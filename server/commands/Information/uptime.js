module.exports = {
	id: "uptime",
	aliases: ["timeup", "up"],
	description: "Returns how it has been since the bot was last restarted.",
	access: "Public",
	exec: ({ safeSend, client }) => safeSend(`The bot has been online for ${client.uptime.expandPretty()}`)
};
