module.exports = {
	id: "uptime",
	aliases: ["timeup"],
	description: "Returns how it has been since the bot was last restarted.",
	execute: (call) => {
		call.message.send(`The bot has been online for ${call.client.uptime.expandPretty()}`).catch(() => {
			call.message.author.send(`You attempted to run the \`uptime\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
		});
	}
};
