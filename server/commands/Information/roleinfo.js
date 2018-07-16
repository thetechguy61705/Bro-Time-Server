const { RichEmbed } = require("discord.js");

module.exports = {
	id: "roleinfo",
	aliases: ["roleinformation", "inforole", "ri"],
	description: "Displays information on the specified role.",
	paramsHelp: "(role)",
	access: "Server",
	execute: (call) => {
		var role = call.params.readRole();
		if (role != null) {
			var infoEmbed = new RichEmbed()
				.setTitle("Information on " + role.name)
				.setColor(role.hexColor)
				.addField("Name", role.name, true)
				.addField("Mention", role.toString(), true)
				.addField("ID", role.id, true)
				.addField("Members", role.members.size.toString(), true)
				.addField("Created At", role.createdAt.toString().substring(0, 15), true)
				.addField("Position", role.position.toString(), true)
				.addField("Automation", role.managed.toString(), true)
				.addField("Hoisted", role.hoist.toString(), true)
				.addField("Mentionable", role.mentionable.toString(), true)
				.addField("Color", role.hexColor + " - " + role.color, true);
			infoEmbed.setDefaultFooter(call.message.author);
			call.safeSend(null, call.message, { embed: infoEmbed });
		} else call.safeSend("You did not specify a valid role.");
	}
};
