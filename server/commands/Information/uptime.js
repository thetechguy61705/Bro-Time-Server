module.exports = {
	id: "uptime",
	aliases: ["timeup"],
	description: "Returns how it has been since the bot was last restarted.",
	access: "Public",
	execute: (call) => {
		call.safeSend(`The bot has been online for ${call.client.uptime.expandPretty()}`);
	}
};
