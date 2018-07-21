module.exports = {
	id: "uptime",
	aliases: ["timeup", "up"],
	description: "Returns how it has been since the bot was last restarted.",
	access: "Public",
	exec: (call) => {
		call.safeSend(`The bot has been online for ${call.client.uptime.expandPretty()}`);
	}
};
