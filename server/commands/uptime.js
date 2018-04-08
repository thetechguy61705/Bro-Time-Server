module.exports = {
	id: "uptime",
	aliases: ["timeup"],
	load: () => {},
	execute: (call) => {
		const uptime = call.client.uptime;
		const hours = `\`${(uptime) - (uptime % 3600000)}\` hours, `;
		const minutes = `\`${(uptime % 3600000) - (uptime % 3600000) % (60000)}\` minutes, `;
		const seconds = `\`${((uptime % 3600000) % 60000) - (((uptime % 3600000) % 60000) % 1000)}\` seconds and `;
		const milliseconds = `\`${(((uptime % 3600000) % 60000) % 1000) - (((uptime % 3600000) % 60000) % 1)}\` milliseconds.`;
		call.message.channel
			.send("The bot has been online for "+hours+minutes+seconds+milliseconds)
			.catch(() => {
				call.message.author.send(`You attempted to run the \`uptime\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
	}
};
