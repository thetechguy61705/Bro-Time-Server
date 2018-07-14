import { Client, Shard, Snowflake } from "discord.js";
import { Pool, PoolClient } from "pg";
const config = require("@root/config");
const escapeRegExp = require("escape-string-regexp");
var client: Client = null;
var pending: DataRequest[] = [];
var nextRequestId = 0;
var pool: Pool = null;

const DEFAULT_PREFIX = "/";

export const PREFIX_DEFAULT = DEFAULT_PREFIX;

export class DataRequest {
    public static REQUEST_TYPE = new Enum(["RoundTrip"])
    public sentInstance: string = "DataRequest"
    public type: any
    public requestId: number
    public resolve?: { (value?: any): void }
    public reject?: { (reason?: any): void }

    public isInvalid?: boolean = false;

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

    private static async doTransaction(
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
        // todo: Deprecate discord.AddBot sql function.
        return DataRequest.doTransaction(async (connection: PoolClient) => {
            return guildId == null ? DEFAULT_PREFIX : (await connection.query(`SELECT Prefix
                FROM discord.Servers
                WHERE Server_Id = $1`, [guildId])).rows[0].prefix || DEFAULT_PREFIX;
        }, async () => {
            return DEFAULT_PREFIX;
        });
    }

    // todo: Implement setting a prefix.

    // todo: Implement getting a wallet total.

    // todo: Implement changing a wallet amount.

    // todo: Implement transfering a wallet amount.
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

export function setClient(newClient: Client): void {
    client = newClient;
}

export function processServer(request: DataRequest, shard: Shard): void {
    var result: any;
    switch (DataRequest.REQUEST_TYPE.get(request.type)) {
        case DataRequest.REQUEST_TYPE.RoundTrip: {
            if (request.isInvalid)
                result = new Error("The request was intentionally made invalid.");
            break;
        }
        default:
            result = new Error("The data request type has not been implemented.");
    }
    shard.process.send(new DataResponse(result, request.requestId));
}

export function processClient(response: DataResponse): void {
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
}

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
