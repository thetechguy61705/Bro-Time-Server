var config = require("../config");
var { Guild } = require("discord.js");
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

class DataAccess {
	constructor() {
		this._pool = pool;
		this.loaded = false;
	}

	load() {
		if (this.loaded)
			throw "Data has already been loaded.";
		this.loaded = true;
	}
}

class GameAccess extends DataAccess {
	constructor(game, games) {
		super();
		this.games = games;
		this._game = game;
	}

	load() {
		super.load();
		return this._game.load();
	}
}

class BotAccess extends DataAccess {
	constructor(area, client) {
		super();
		this._client = client;
		if (area instanceof Guild)
			this.server = area;
		this.prefix = DM_PREFIX;
	}

	async load() {
		super.load();
		if (this._pool != null && this.server != null) {
			var client = await this._pool.connect();
			// Provide the bot id and server id.
			await client.query("SELECT discord.AddBot($1) FOR UPDATE", [this.server.id]);
			this.prefix = (await client.query(`SELECT Prefix
			                                   FROM discord.Servers
			                                   WHERE Server_Id = $1`, [this.server.id])).rows[0].prefix;
			client.release();
		}
		return true;
	}

	async setPrefix(newPrefix) {
		if (this.server == null)
			throw new Error("Cannot set a prefix for non-server data.");
		newPrefix = escapeRegExp(newPrefix);
		if (this._pool != null)
			await this._pool.query(`UPDATE discord.Servers
		                            SET Prefix = $2
		                            WHERE Server_Id = $1`, [this.server.id, newPrefix]);
		this.prefix = newPrefix;
		return true;
	}
}

class WalletAccess {
	constructor(userId = null) {
		this.TRANSFER_RATE = WalletAccess.TRANSFER_RATE;
		this._userId = userId;
		this.client = require("../server/server").client;
	}

	async getTotal() {
		var result = (await pool.query("SELECT discord.WalletGet($1)", [this._userId])).rows[0].walletget;
		if (result === -1)
			result = Infinity;
		return result;
	}

	async change(amount) {
		await pool.query("SELECT discord.WalletChange($2, $1) FOR UPDATE", [this._userId, amount]);
		this.getTotal().then((newTotal) => {
			this.client.emit("walletChange", this._userId, amount, newTotal);
		});
		return true;
	}

	async transfer(amount, toUserId = null) {
		await pool.query("SELECT discord.WalletTransfer($3, $1, $2) FOR UPDATE", [this._userId, toUserId, amount]);
		this.getTotal().then((newTotal) => {
			this.client.emit("walletChange", this._userId, -amount, newTotal);
		});
		new WalletAccess(toUserId).getTotal().then((newTotal) => {
			this.client.emit("walletChange", toUserId, amount - amount * this.TRANSFER_RATE, newTotal);
		});
		return true;
	}
}
WalletAccess.TRANSFER_RATE = .20;

module.exports = {
	BotAccess: BotAccess,
	GameAccess: GameAccess,
	WalletAccess: WalletAccess
};
