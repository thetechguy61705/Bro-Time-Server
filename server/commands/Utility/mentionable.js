const isModerator = require("@utility/moderator");

module.exports = {
	id: "mentionable",
	aliases: ["mt", "mf", "togglementionable", "ment"],
	description: "Toggle the mentionability of a role.",
	paramsHelp: "(role)",
	requires: "Moderator permissions",
	access: "Server",
	botRequires: ["MANAGE_ROLES"],
	botRequiresMessage: "To change the mentionability of roles.",
	exec: (call) => {
		var data = (call.message.guild || call.message.channel).data,
			prefix = data != null ? data.prefix : "/",
			role = call.params.readRole();
		if (isModerator(call.message.member)) {
			if (role != null) {
				var mention = (call.message.content.toLowerCase().startsWith(prefix + "mt")) ? true
					: (call.message.content.toLowerCase().startsWith(prefix + "mf")) ? false : !role.mentionable;
				role.setMentionable(mention)
					.then(() => call.message.delete())
					.catch(() => call.safeSend(`There was an error changing the mentionability of the role \`${role.name}\` to \`${mention}\`.`));
			} else call.safeSend("Invalid role. Please try again.");
		} else call.safeSend("You do not have permission to use this command!");
	}
};
