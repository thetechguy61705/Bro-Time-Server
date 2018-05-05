const { Guild } = require("discord.js");
var pool;

class Settings {
	static CACHE = 0x00000001;
	static SAVE = 0x00000002;

	constructor(newPool, namespace, association) {
		pool = newPool;
		this.dirty = false;
		this.data = {};
		this.namespace = namespace;
		if (association == null) {
			this.serverId = null;
			this.userId = null;
		} else if (association instanceof Guild) {
			this.serverId = association.id;
			this.userId = null;
		} else {
			this.serverId = association.guild.id;
			this.userId = association.id;
		}
	}

	async get(key, options = this.CACHE) {
		var result = await pool.query("SELECT discord.GetSettings($1, $2, $3)",
			[this.namespace, this.serverId, this.userId]);
		this.data = result.rows[0];
		return this.data[key];
	}

	set(key, value, options = this.CACHE) {
		this.data[key] = value;
		this.dirty = true;
		pool.query("SELECT discord.SetSettings($1, $2, $3, $4) FOR UPDATE",
			[this.namespace, this.data, this.serverId, this.userId],
			(err) => {
				if (err) {
					console.warn("Unable to save settings: " + err.stack);
				} else {
					this.dirty = false;
				}
			});
	}
}

module.exports = Settings;
