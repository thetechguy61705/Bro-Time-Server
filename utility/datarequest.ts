import { Client, Shard, Snowflake } from "discord.js";
import { Pool, PoolClient } from "pg";
var client: Client = null;
var pending: DataRequest[] = [];
var nextRequestId = 0;

export const PREFIX_DEFAULT = "/";

export class DataRequest {
	public static REQUEST_TYPE = new Enum(["RoundTrip", "GetPrefix", "SetPrefix",
		"WalletGetTotal", "WalletChange", "WalletTransfer"])
	public sentInstance: string = "DataRequest"
	public type: any
	public requestId: number
	public resolve?: { (value?: any): void }
	public reject?: { (reason?: any): void }

	public isInvalid?: boolean = false

	public guildId?: Snowflake
	public newPrefix?: string

	public userId?: Snowflake
	public toUserId?: Snowflake
	public fromUserId?: Snowflake
	public amount?: number

	private constructor(type: any,
		resolve: { (value?: any): void },
		reject: { (reason?: any): void }) {
		this.type = type;
		this.requestId = nextRequestId++;
		this.resolve = resolve;
		this.reject = reject;
	}

	private static sendRequest(request: DataRequest) {
		if (client == null)
			throw new Error("Unable to send a data request from the parent process.");
		pending.push(request);
		client.shard.send(request);
	}

	public static doRoundTrip(isInvalid?: boolean): Promise<any> {
		return new Promise((resolve, reject) => {
			var request = new DataRequest(DataRequest.REQUEST_TYPE.RoundTrip,
				resolve, reject);
			if (isInvalid)
				request.isInvalid = isInvalid;
			DataRequest.sendRequest(request);
		});
	}

	public static getPrefix(guildId: Snowflake): Promise<string> {
		return new Promise((resolve, reject) => {
			var request = new DataRequest(DataRequest.REQUEST_TYPE.GetPrefix,
				resolve, reject);
			request.guildId = guildId;
			DataRequest.sendRequest(request);
		});
	}

	// todo: Implement setting a prefix.
	public static setPrefix(guildId: Snowflake, newPrefix: string): Promise<void> {
		if (guildId == null)
			throw new Error("Cannot set a prefix for a non-guild.");
		if (newPrefix == null)
			throw new Error("A prefix must be provided.");
		return new Promise((resolve, reject) => {
			var request = new DataRequest(DataRequest.REQUEST_TYPE.SetPrefix,
				resolve, reject);
			request.guildId = guildId;
			request.newPrefix = newPrefix;
			DataRequest.sendRequest(request);
		});
	}

	public static walletGetTotal(userId: Snowflake): Promise<number> {
		return new Promise((resolve, reject) => {
			if (userId == null) {
				resolve(Infinity);
			} else {
				var request = new DataRequest(DataRequest.REQUEST_TYPE.WalletGetTotal,
					resolve, reject);
				request.userId = userId;
				DataRequest.sendRequest(request);
			}
		});
	}

	public static walletChange(userId: Snowflake, amount: number): Promise<number> {
		return new Promise((resolve, reject) => {
			if (userId == null) {
				resolve(Infinity);
			} else {
				var request = new DataRequest(DataRequest.REQUEST_TYPE.WalletChange,
					resolve, reject);
				request.userId = userId;
				request.amount = amount;
				DataRequest.sendRequest(request);
			}
		});
	}

	public static walletTransfer(fromUserId: Snowflake, amount: number, toUserId: Snowflake = null): Promise<IWalletTransferResult> {
		return new Promise((resolve, reject) => {
			var request = new DataRequest(DataRequest.REQUEST_TYPE.WalletTransfer,
				resolve, reject);
			request.fromUserId = fromUserId;
			request.toUserId = toUserId;
			request.amount = amount;
			DataRequest.sendRequest(request);
		});
	}
}

export interface IWalletTransferResult {
	toAmount: number
	fromAmount: number
}

export class DataResponse {
	public sentInstance: string = "DataResponse"
	public result?: any
	public isError: boolean;
	public requestId: number

	public constructor(result: any, requestId: number) {
		this.isError = result instanceof Error;
		this.result = this.isError ? result.message : result;
		this.requestId = requestId;
	}
}

if (process.env.SHARD_ID != null) {
	// child

	module.exports.processRequest = function(response: DataResponse): void {
		var index = pending.findIndex((candidate) => candidate.requestId === response.requestId);
		if (index >= 0) {
			var request = pending[index];
			if (response.result != null && response.isError) {
				request.reject(new Error(response.result));
			} else {
				request.resolve(response.result);
			}
			pending.splice(index, 1);
		}
	};

	module.exports.setClient = function (newClient: Client): void {
		client = newClient;
	};
} else {
	// parent

	const config = require("@root/config");
	var pool: Pool = null;

	// eslint-disable-next-line no-inner-declarations
	async function doTransaction(
		onlineTrans: { (connection: PoolClient): Promise<any> },
		offlineTrans: { (): Promise<any> },
		setupTrans: { (): void } = null) {

		var connection: PoolClient = null;
		var result: any;
		try {
			if (setupTrans != null)
				setupTrans();
			if (pool != null) {
				connection = await pool.connect();
				result = await onlineTrans(connection);
			} else {
				result = await offlineTrans();
			}
		} catch (exc) {
			throw exc;
		} finally {
			if (connection != null)
				connection.release();
		}
		return result;
	}

	module.exports.processRequest = async function(request: DataRequest, shard: Shard): Promise<void> {
		var result: any;
		switch (DataRequest.REQUEST_TYPE.get(request.type)) {
		case DataRequest.REQUEST_TYPE.RoundTrip: {
			if (request.isInvalid)
				result = new Error("The request was intentionally made invalid.");
			break;
		}
		case DataRequest.REQUEST_TYPE.GetPrefix: {
			result = await doTransaction(async (connection: PoolClient) => {
				return request.guildId == null ? PREFIX_DEFAULT : ((await connection.query(`SELECT Prefix
					FROM discord.Servers
					WHERE Server_Id = $1`, [request.guildId])).rows[0] || { prefix: PREFIX_DEFAULT }).prefix;
			}, async () => {
				return PREFIX_DEFAULT;
			});
			break;
		}
		case DataRequest.REQUEST_TYPE.SetPrefix: {
			await doTransaction(async (connection: PoolClient) => {
				await connection.query(`UPDATE discord.Servers
					SET Prefix = $2
					WHERE Server_Id = $1`, [request.guildId, request.newPrefix]);
			}, async () => {});
			break;
		}
		case DataRequest.REQUEST_TYPE.WalletGetTotal: {
			result = await doTransaction(async (connection: PoolClient) => {
				return (await connection.query("SELECT discord.WalletGet($1)",
					[request.userId])).rows[0].walletget;
			}, async () => {});
			break;
		}
		case DataRequest.REQUEST_TYPE.WalletChange: {
			result = await doTransaction(async (connection: PoolClient) => {
				var amount = (await connection.query("SELECT discord.WalletChange($2, $1) FOR UPDATE",
					[request.userId, request.amount])).rows[0].walletchange;

				shard.manager.broadcastEval(`this.emit('walletChange', '${request.userId}', ${amount});`);

				return amount;
			}, async () => {});
			break;
		}
		case DataRequest.REQUEST_TYPE.WalletTransfer: {
			result = await doTransaction(async (connection: PoolClient) => {
				var amounts = (await connection.query("SELECT discord.WalletTransfer($3, $1, $2) FOR UPDATE",
					[request.fromUserId, request.toUserId, request.amount])).rows[0].wallettransfer;

				shard.manager.broadcastEval(`this.emit('walletChange', '${request.fromUserId}', ${amounts.from_amount});`);
				shard.manager.broadcastEval(`this.emit('walletChange', '${request.toUserId}', ${amounts.to_amount});`);

				amounts = { fromAmount: amounts.from_amount, toAmount: amounts.to_amount };
				if (amounts.fromAmount === -1)
					amounts.fromAmount = Infinity;
				if (amounts.toAmount === -1)
					amounts.toAmount = Infinity;
				return amounts;
			}, async () => {});
			break;
		}
		default:
			result = new Error("The data request type has not been implemented.");
		}
		shard.process.send(new DataResponse(result, request.requestId));
	};

	try {
		pool = config.DB != null ? new Pool({
			max: config.DB_CONNECTIONS,
			connectionString: config.DB
		}) : null;

		if (pool != null) {
			process.on("SIGTERM", async () => {
				await pool.end();
			});
		} else {
			console.warn("No database provided. The server will run without data persistence.");
		}
	} catch (exc) {
		console.warn("Unable to connect to a database:");
		console.warn(exc.stack);
	}
}
