const { Guild } = require("discord.js");
var objects = [];
var pool;

class Settings {
	static get(newPool, namespace, association) {
		var serverId, userId;
		pool = newPool;
		if (association == null) {
			serverId = null;
			userId = null;
		} else if (association instanceof Guild) {
			serverId = association.id;
			userId = null;
		} else {
			serverId = association.guild.id;
			userId = association.id;
		}
		return objects.find((object) => {
			return object.namespace === namespace &&
			object.serverId === serverId &&
			object.userId === userId;
		}) || new Settings(namespace, serverId, userId);
	}

	constructor(namespace, serverId, userId) {
		this.dirty = false;
		this.data = {};
		this.namespace = namespace;
		this.serverId = serverId;
		this.userId = userId;
		objects.push(this);
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
Settings.CACHE = 0x00000001;
Settings.SAVE = 0x00000002;

module.exports = Settings;
