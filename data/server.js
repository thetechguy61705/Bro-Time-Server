var config = require("../config");
var discord = require("discord.js");
const {Pool} = require("pg");

const DM_PREFIX = "/";

function escapeRegExp(str) {
	// eslint-disable-next-line
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const pool = new Pool({
	max: config.DB_CONNECTIONS,
	host: config.DB_HOST,
	port: config.DB_PORT,
	database: config.DB_NAME,
	user: config.DB_USER,
	password: config.DB_PASSWPRD
});

process.on("SIGTERM", async () => {
	await pool.end();
});

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

class CommandAccess extends DataAccess {
	constructor(command) {
		super();
		this._command = command;
	}

	load() {
		super.load();

	}
}

class BotAccess extends DataAccess {
	constructor(area, client) {
		super();
		this._client = client;
		if (area instanceof discord.Channel) {
			this.dm = area;
		} else {
			this.server = area;
		}
	}

	async load() {
		super.load();
		if (this.server !== null) {
			var client = await this._pool.connect();
			// Provide the bot id and server id.
			await client.query("SELECT discord.AddBot($1) FOR UPDATE", [this.server.id]);
			this.prefix = (await client.query(`SELECT Prefix
			                                FROM discord.Servers
			                                WHERE Server_Id = $1`, [this.server.id])).rows[0].prefix;
			client.release();
		} else {
			this.prefix = DM_PREFIX;
		}
	}

	async setPrefix(newPrefix) {
		newPrefix = escapeRegExp(newPrefix);
		await this._pool.query(`UPDATE discord.Servers
		                        SET Prefix = $2
		                        WHERE Server_Id = $1`, [this.server.id, newPrefix]);
		this.prefix = newPrefix;
	}
}

module.exports = {
	BotAccess: BotAccess,
	CommandAccess: CommandAccess
};
