module.exports = {
	id: "postqotd",
	load: () => {},
	execute: (call) => {
		if(call.message.member.roles.has("392041430610214912")) {
			let ann = call.message.guild.channels.get("330920609435353090");
			let qotd = call.params.readRaw(" ");
			let qotdrole = call.message.guild.roles.get("387375439745908747");
			qotdrole.setMentionable(true).then(() => {
				ann.send(`<@&387375439745908747>: **${qotd}**\n*Posted by ${call.message.author}*`);
				qotdrole.setMentionable(false);
			}).catch(() => {
				call.message.channel.send("Something went wrong and I couldn't send the QoTD");
			});

		}
	}
};
