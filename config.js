module.exports = {
	BOTS: {
		[process.env.BRO_TIME_TOKEN]: {
			TRACKING: process.env.BRO_TIME_TRACKING_ID
		},
		[process.env.KITCHEN_TOKEN]: {}
	},
	DB_CONNECTIONS: 20,
	DB: process.env.DB
};
