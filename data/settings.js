var pool;

class Settings {
	static CACHE = 0x00000001;
	static SAVE = 0x00000002;

	constructor(newPool, namespace, association) {
		pool = newPool;

	}

	get(key, options = this.CACHE) {
		
	}

	set(key, value, options = this.CACHE) {
		
	}
}

module.exports = Settings;
