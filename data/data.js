var config = require("../config");
var discord = require("discord.js");
const { Pool } = require("pg");
const escapeRegExp = require("escape-string-regexp");
const Settings = require("./settings");

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
		this._command.load(this);
		super.load();
	}

	canAccess() {
		// message
		return true;
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
		if (pool != null && this.server != null) {
			var client = await pool.connect();
			try {
				// Provide the bot id and server id.
				await client.query("SELECT discord.AddBot($1) FOR UPDATE", [this.server.id]);
				this.prefix = (await client.query(`SELECT Prefix
				                                   FROM discord.Servers
				                                   WHERE Server_Id = $1`, [this.server.id])).rows[0].prefix;
			} finally {
				client.release();
			}
		} else {
			this.prefix = DM_PREFIX;
		}
	}

	async setPrefix(newPrefix) {
		if (this.server == null)
			throw new Error("Cannot set a prefix for non-server data.");
		newPrefix = escapeRegExp(newPrefix);
		if (pool != null)
			await pool.query(`UPDATE discord.Servers
		                            SET Prefix = $2
		                            WHERE Server_Id = $1`, [this.server.id, newPrefix]);
		this.prefix = newPrefix;
	}

	getSettings(namespace = "global", association) {
		return new Settings(pool, namespace, association);
	}
}

module.exports = {
	BotAccess: BotAccess,
	CommandAccess: CommandAccess
};
