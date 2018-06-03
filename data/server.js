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
			try {
				result = (await pool.query(`SELECT COALESCE((SELECT Amount
				                            	FROM discord.Wallet
				                            	WHERE User_Id = $1), 0) AS "Amount";`, [this._userId])).rows[0].Amount;
			} catch {
				throw new Error("Unable to get the wallet's total.");
			}
		}
		return result;
	}

	async change(amount) {
		if (!this.isBank) {
			try {
				pool.query(`INSERT INTO discord.Wallet(User_Id, Amount)
				            	VALUES($1, $2)
				            ON CONFLICT ON CONSTRAINT Wallet_User_Id_PK DO UPDATE
				            	SET Amount = discord.Wallet.Amount + $2;`, [this._userId, amount]);
			} catch (exc) {
				if (exc.description.includes("wallet_amount_c")) {
					if (amount < 0) {
						throw new Error("The wallet can't have a negative amount.");
					} else {
						throw new Error("The wallet can't have over 1 billion.");
					}
				} else {
					throw new Error("Unable to change amount.");
				}
			}
		}
	}

	async transfer(amount, toUserId = null) {
		try {
			if (!this.isBank && toUserId != null) {
				pool.query(`BEGIN;
				            UPDATE discord.Wallet
				            	SET Amount = Amount - $3
				            WHERE User_Id = $1;
				            INSERT INTO discord.Wallet(User_Id, Amount)
				            	VALUES($2, $3)
				            ON CONFLICT ON CONSTRAINT Wallet_User_Id_PK DO UPDATE
				            	SET Amount = discord.Wallet.Amount + $3;
				            COMMIT;`, [this._userId, toUserId, amount]);
			} else if (!this.isBank) {
				pool.query(`UPDATE discord.Wallet
				            	SET Amount = Amount - $2
				            WHERE User_Id = $1;`, [this._userId, amount]);
			} else {
				pool.query(`INSERT INTO discord.Wallet(User_Id, Amount)
				            	VALUES($1, $2)
				            ON CONFLICT ON CONSTRAINT Wallet_User_Id_PK DO UPDATE
				            	SET Amount = discord.Wallet.Amount + $2;`, [toUserId, amount]);
			}
		} catch {
			throw new Error("Unable to transfer amount.");
		}
	}
}

module.exports = {
	BotAccess: BotAccess,
	GameAccess: GameAccess,
	WalletAccess: WalletAccess
};
