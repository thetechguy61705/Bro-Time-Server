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
} catch(exc) {
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
	}
}

class WalletAccess {
	constructor(userId = null) {
		this.isBank = userId == null;
		this._userId = userId;
	}

	async getTotal() {
		var result;
		if (this.isBank) {
			result = Infinity;
		} else {
			result = pool.query(`SELECT COALESCE((SELECT Amount AS "Amount"
			                                      FROM discord.Wallet
			                                      WHERE User_Id = $1), 0);`, [this._userId]);
		}
		return result;
	}

	async change(amount) {
		console.log(amount);
	}

	async transfer(amount, toUserId) {
		console.log(amount, toUserId);
	}
}

module.exports = {
	BotAccess: BotAccess,
	GameAccess: GameAccess,
	WalletAccess: WalletAccess
};
