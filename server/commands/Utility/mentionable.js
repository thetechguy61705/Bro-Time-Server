const isModerator = require("app/moderator");

module.exports = {
	id: "mentionable",
	aliases: ["mt", "mf", "togglementionable", "ment"],
	description: "Toggle the mentionability of a role.",
	paramsHelp: "(role)",
	requires: "Moderator permissions",
	execute: (call) => {
		const DATA = (call.message.guild || call.message.channel).data,
			PREFIX = DATA != null ? DATA.prefix : "/",
			ROLE = call.params.readRole();
		if (isModerator(call.message.member)) {
			if (ROLE != null) {
				const MENTION = (call.message.content.toLowerCase().startsWith(PREFIX + "mt")) ? true
					: (call.message.content.toLowerCase().startsWith(PREFIX + "mf")) ? false : !ROLE.mentionable;
				ROLE.setMentionable(MENTION).then(() => {
					call.message.delete();
				}).catch(() => {
					call.message.reply(`There was an error changing the mentionability of the role \`${ROLE.name}\` to \`${MENTION}\`.`).catch(() => {
						call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`);
					});
				});
			} else {
				call.message.reply("Invalid role. Please try again.").catch(() => {
					call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`);
				});
			}
		} else {
			call.message.reply("You do not have permission to use this command!").catch(() => {
				call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`);
			});
		}
	}
};
