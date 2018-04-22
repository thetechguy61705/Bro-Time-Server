module.exports = {
	id: "uptime",
	aliases: ["timeup"],
	load: () => {},
	execute: (call) => {
		const uptime = call.client.uptime;
		var days = ((uptime) - (uptime % 86400000)) / 86400000;
		var hours = (((uptime) - (uptime % 3600000)) / 3600000) - (days * 24);
		var minutes = ((uptime % 3600000) - (uptime % 3600000) % (60000)) / 60000;
		var seconds = ((uptime % 3600000) % 60000) - (((uptime % 3600000) % 60000) % 1000);
		var milliseconds = (((uptime % 3600000) % 60000) % 1000) - (((uptime % 3600000) % 60000) % 1);
		if (days !== 0) days = `\`${days}\` days, `; else days = "";
		if (hours !== 0) hours = `\`${hours}\` hours, `; else hours = "";
		if (minutes !== 0) minutes = `\`${minutes}\` minutes, `; else minutes = "";
		if ((seconds/1000) !== 0) seconds = `\`${seconds/1000}\` seconds, `; else seconds = "";
		milliseconds = `and \`${milliseconds}\` milliseconds.`;
		call.message
			.reply(`The bot has been online for ${days}${hours}${minutes}${seconds}${milliseconds}`)
			.catch(() => {
				call.message.author.send(`You attempted to run the \`uptime\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
	}
};
