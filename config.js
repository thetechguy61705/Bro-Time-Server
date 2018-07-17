var config = {
	TOKEN: process.env.BRO_TIME_TOKEN,
	GOOGLE: process.env.GOOGLE_KEY,
	DB_CONNECTIONS: 20,
	DB: process.env.DB,
	CLIENT: {
		disableEveryone: true
	},
	SHARD: {}
};

try {
	var userConfig = require("./user_config");
	for (var [key, value] of Object.entries(userConfig))
		config[key] = value;
} catch (exc) {
	if (exc.code !== "MODULE_NOT_FOUND")
		throw exc;
}
config.SHARD.token = config.TOKEN;

module.exports = config;
