var config = {
	BOTS: [
		{
			token: process.env.BRO_TIME_TOKEN
		},
		{
			token: process.env.KITCHEN_TOKEN
		}
	],
	DB_CONNECTIONS: 20,
	DB: process.env.DB
};

try {
	var userConfig = require("./user_config");
	if (userConfig.DB != null)
		config.DB = userConfig.DB;
	for (var i = 0; i < userConfig.BOTS.length; i++) {
		if (userConfig.BOTS[i] != null)
			config.BOTS[i].token = userConfig.BOTS[i];
	}
} catch (exc) {
	if (exc.code !== "MODULE_NOT_FOUND")
		throw exc;
}

module.exports = config;
