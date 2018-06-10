module.exports = {
	id: "postqotd",
	description: "Posts the specified \"Question of The Day\" in <#330920609435353090>.",
	paramsHelp: "(qotd)",
	requires: "Role: QoTD Host",
	execute: (call) => {
		if (call.message.member.roles.has(call.message.guild.roles.find("name", "QOTD Host").id)) {
			const ANN_CHANNEL = call.message.guild.channels.find("name", "announcements"),
				QOTD = call.params.readRaw(" "),
				QOTD_ROLE = call.message.guild.roles.find("name", "QOTD");
			if (QOTD !== "") {
				QOTD_ROLE.setMentionable(true).then(() => {
					ANN_CHANNEL.send(`${QOTD_ROLE}: **${QOTD}**\n*Posted by ${call.message.author}*`);
					QOTD_ROLE.setMentionable(false);
				}).catch(() => {
					call.message.channel.send("Something went wrong and I couldn't send the QoTD");
				});
			} else {
				call.message.reply("You did not supply the question to post. Please try again.").catch(() => {
					call.message.author.send(`You attempted to run the \`postqotd\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("Invalid permissions: requires role: `QOTD Host`").catch(() => {
				call.message.author.send(`You attempted to run the \`postqotd\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
