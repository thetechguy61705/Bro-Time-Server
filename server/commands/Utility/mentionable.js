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
					call.safeSend(`There was an error changing the mentionability of the role \`${ROLE.name}\` to \`${MENTION}\`.`);
				});
			} else call.safeSend("Invalid role. Please try again.");
		} else call.safeSend("You do not have permission to use this command!");
	}
};
