var config = {
	CLIENT: {
		fetchAllMembers: true
	},
	TOKEN: process.env.BRO_TIME_TOKEN,
	GOOGLE: process.env.GOOGLE_KEY,
	DB_CONNECTIONS: 20,
	DB: process.env.DB
};

try {
	var userConfig = require("./user_config");
	for (var [key, value] of Object.entries(userConfig)) {
		config[key] = value;
	}
	console.log(config);
} catch (exc) {
	if (exc.code !== "MODULE_NOT_FOUND")
		throw exc;
}

module.exports = config;
