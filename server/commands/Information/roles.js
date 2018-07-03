const { RichEmbed } = require("discord.js");

module.exports = {
	id: "roles",
	aliases: ["userroles"],
	description: "Displays the specified user's roles.",
	paramsHelp: "[user]",
	access: "Server",
	execute: (call) => {
		var member = call.params.readMember();
		if (member != null) {
			var roles = ("`" + member.roles.map((role) => role.name).join("`, `") + "`").substring(0, 2045);
			var rolesEmbed = new RichEmbed()
				.setTitle(member.user.tag + "'s roles.")
				.setDescription(roles + (roles.length === 2045 ? "..." : ""))
				.setColor(0x00AE86);
			if (roles.length === 2045) rolesEmbed.setFooter("Not all roles that this user obtains are included in this list because of rich embed description limitations.");
			rolesEmbed.setDefaultFooter(call.message.author);
			call.safeSend(null, call.message, { embed: rolesEmbed });
		} else call.safeSend("You did not specify a valid user.");
	}
};
