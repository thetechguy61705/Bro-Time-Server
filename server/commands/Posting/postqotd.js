module.exports = {
	id: "postqotd",
	description: "Posts the specified \"Question of The Day\" in <#330920609435353090>.",
	paramsHelp: "(qotd)",
	requires: "Role: QoTD Host",
	access: "Server",
	exec: (call) => {
		if (call.message.member.roles.has(call.message.guild.roles.find("name", "QOTD Host").id)) {
			const ANN_CHANNEL = call.message.guild.channels.find("name", "announcements"),
				QOTD = call.params.readRaw(" "),
				QOTD_ROLE = call.message.guild.roles.find((role) => role.name === "QOTD");
			if (QOTD !== "") {
				QOTD_ROLE.setMentionable(true).then(() => {
					ANN_CHANNEL.send(`${QOTD_ROLE}: **${QOTD}**\n*Posted by ${call.message.author}*`);
					QOTD_ROLE.setMentionable(false);
				}).catch(() => {
					call.safeSend("Something went wrong and I couldn't send the QoTD");
				});
			} else call.safeSend("You did not supply the question to post. Please try again.");
		} else call.safeSend("Invalid permissions: requires role: `QOTD Host`");
	}
};
