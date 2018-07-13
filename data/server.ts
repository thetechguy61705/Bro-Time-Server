import { ILoadable } from "types/server";
import { Guild, Client, Snowflake } from "discord.js";
const config = require("@root/config");
const { Pool } = require("pg");
const escapeRegExp = require("escape-string-regexp");

const DM_PREFIX = "/";

var pool = null;
try {
	pool = config.DB != null ? new Pool({
		max: config.DB_CONNECTIONS,
		connectionString: config.DB
	}) : null;
} catch (exc) {
	console.warn("Unable to connect to the database.");
	console.warn(exc.stack);
}

if (pool != null) {
	process.on("SIGTERM", async () => {
		await pool.end();
	});
} else {
	console.warn("No database provided. The server will run without data persistence.");
}

export class GameAccess implements ILoadable<void> {
	public readonly games: any
	private readonly _game: any

	public constructor(game, games) {
		this.games = games;
		this._game = game;
	}

	public load() {
		return this._game.load();
	}
}

export class BotAccess implements ILoadable<void> {
	private readonly _client: Client
	public readonly server: Guild
	public prefix: string

	public constructor(area, client: Client) {
		this._client = client;
		if (area instanceof Guild)
			this.server = area;
		this.prefix = DM_PREFIX;
	}

	public async load() {
		if (pool != null && this.server != null) {
			var client = await pool.connect();
			// Provide the bot id and server id.
			await client.query("SELECT discord.AddBot($1) FOR UPDATE", [this.server.id]);
			this.prefix = (await client.query(`SELECT Prefix
			                                   FROM discord.Servers
			                                   WHERE Server_Id = $1`, [this.server.id])).rows[0].prefix;
			client.release();
		}
		return true;
	}

	public async setPrefix(newPrefix) {
		if (this.server == null)
			throw new Error("Cannot set a prefix for non-server data.");
		newPrefix = escapeRegExp(newPrefix);
		if (pool != null)
			await pool.query(`UPDATE discord.Servers
		                            SET Prefix = $2
		                            WHERE Server_Id = $1`, [this.server.id, newPrefix]);
		this.prefix = newPrefix;
		return true;
	}
}

export class WalletAccess {
	public static readonly TRANSFER_RATE: number = .20
	public readonly TRANSFER_RATE: number = WalletAccess.TRANSFER_RATE
	private readonly _userId: Snowflake
	private readonly _client: Client

	constructor(userId: Snowflake = null) {
		this.TRANSFER_RATE = WalletAccess.TRANSFER_RATE;
		this._userId = userId;
		this._client = require("@server/server").client;
	}

	async getTotal() {
		var result = (await pool.query("SELECT discord.WalletGet($1)", [this._userId])).rows[0].walletget;
		if (result === -1)
			result = Infinity;
		return result;
	}

	async change(amount: number) {
		await pool.query("SELECT discord.WalletChange($2, $1) FOR UPDATE", [this._userId, amount]);
		this.getTotal().then((newTotal) => {
			this._client.shard.broadcastEval(`this.emit('walletChange', '${this._userId}', ${amount}, ${newTotal});`);
		});
		return true;
	}

	async transfer(amount: number, toUserId: Snowflake = null) {
		await pool.query("SELECT discord.WalletTransfer($3, $1, $2) FOR UPDATE", [this._userId, toUserId, amount]);
		this.getTotal().then((newTotal) => {
			this._client.shard.broadcastEval(`this.emit('walletChange', '${this._userId},' -${amount}, ${newTotal});`);
		});
		new WalletAccess(toUserId).getTotal().then((newTotal) => {
			this._client.shard.broadcastEval(`this.emit('walletChange', '${toUserId}', ${amount} - ${amount} * ${this.TRANSFER_RATE}, ${newTotal});`);
		});
		return true;
	}
}
