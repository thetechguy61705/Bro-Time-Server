module.exports = {
	TOKENS: [
		process.env.BRO_TIME_TOKEN,
		process.env.KITCHEN_TOKEN
	],
	DB_CONNECTIONS: 20,
	DB_HOST: process.env.DB_HOST,
	DB_USER: process.env.DB_USER,
	DB_PASSWPRD: process.env.DB_PASSWORD,
	DB_NAME: process.env.DB_NAME,
	DB_PORT: process.env.DB_PORT
};
