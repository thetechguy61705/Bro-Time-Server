var config = require("../config");
var discord = require("discord.js");
const {Pool} = require("pg");
var fs = require("fs");

const pool = new Pool({
	max: config.DB_CONNECTIONS,
	host: config.DB_HOST,
	port: config.DB_PORT,
	database: config.DB_NAME,
	user: config.DB_USER,
	password: config.DB_PASSWPRD
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
	constructor(area) {
		super();
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
			await client.query(fs.readFileSync(__dirname + "/setup.sql", "utf8"));
			// Call the procedure to add bot (and optionally server) settings.
			// If server, get the server prefix and set it, else, set to forward slash.
			client.release();
		}
	}

	forCommand() {
		let data = new CommandAccess();
		data.load();
		return data;
	}
}

module.exports = BotAccess;
