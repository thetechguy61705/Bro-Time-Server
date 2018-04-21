const { Guild } = require("discord.js");
var pool;

class Settings {
	static CACHE = 0x00000001;
	static SAVE = 0x00000002;

	constructor(newPool, namespace, association) {
		pool = newPool;
		if (association instanceof Guild) {
			this.serverId = association.id;
			this.userId = null;
		} else {
			this.serverId = association.guild.id;
			this.userId = association.id;
		}
	}

	get(key, options = this.CACHE) {
		
	}

	set(key, value, options = this.CACHE) {
		
	}
}

module.exports = Settings;
