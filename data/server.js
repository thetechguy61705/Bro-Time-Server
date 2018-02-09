var config = require("../config");
var discord = require("discord.js");
const {Pool} = require("pg");

const DM_PREFIX = "/";

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
	constructor() {
		super();
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
			await client.query("SELECT discord.AddBot($1, $2) FOR UPDATE", [this._client.user.id, this.server.id]);
			this.prefix = (await client.query(`SELECT Prefix
			                                FROM discord.Servers
			                                WHERE Server_Id = $1`, [this.server.id])).rows[0].prefix;
			client.release();
		} else {
			this.prefix = DM_PREFIX;
		}
	}

	forCommand() {
		let data = new CommandAccess();
		data.load();
		return data;
	}
}

module.exports = BotAccess;
