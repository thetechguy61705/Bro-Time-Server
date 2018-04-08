module.exports = {
	id: "uptime",
	aliases: ["timeup"],
	load: () => {},
	execute: (call) => {
		const uptime = call.client.uptime;
		const hours = ((uptime) - (uptime % 3600000))/3600000;
		const minutes = ((uptime % 3600000) - (uptime % 3600000) % (60000))/60000;
		const seconds = ((uptime % 3600000) % 60000) - (((uptime % 3600000) % 60000) % 1000);
		const milliseconds = (((uptime % 3600000) % 60000) % 1000) - (((uptime % 3600000) % 60000) % 1)
		call.message.channel
			.send(`The bot has been offline for ${hours} hours, ${minutes} minutes, ${seconds/1000} seconds and ${milliseconds} milliseconds`)
			.catch(() => {
				call.message.author.send(`You attempted to run the \`uptime\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
	}
};
