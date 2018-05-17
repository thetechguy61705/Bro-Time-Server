module.exports = {
	id: "postqotd",
	description: "Posts the specified \"Question of The Day\" in <#330920609435353090>.",
	arguments: "(qotd)",
	requires: "Role: QoTD Host",
	execute: (call) => {
		if(call.message.member.roles.has(call.message.guild.roles.find("name", "QOTD Host").id)) {
			let ann = call.message.guild.channels.find("name", "announcements");
			let qotd = call.params.readRaw(" ");
			let qotdrole = call.message.guild.roles.find("name", "QOTD");
			qotdrole.setMentionable(true).then(() => {
				ann.send(`<@&387375439745908747>: **${qotd}**\n*Posted by ${call.message.author}*`);
				qotdrole.setMentionable(false);
			}).catch(() => {
				call.message.channel.send("Something went wrong and I couldn't send the QoTD");
			});

		} else {
			call.message.reply("Invalid permissions: requires role: `QOTD Host`").catch(() => {
				call.message.author.send(`You attempted to run the \`postqotd\` command in ${call.message.channel}, but I can not chat there.`)
					.catch(function(){});
			});
		}
	}
};
