const { RichEmbed } = require("discord.js");
module.exports = {
	id: "membercount",
	description: "Displays the current member count",
	execute: (call) => {
		var members = call.message.guild.memberCount,
			online = call.message.guild.members.filter((m) => m.presence.status !== "offline").size,
			humans = call.message.guild.members.filter((m) => !m.user.bot).size,
			bots = members - humans;
		var memberEmbed = new RichEmbed()
			.addField("Members", members)
			.addField("Online", online)
			.addField("Humans", humans)
			.addField("Bots", bots)
			.setDefaultFooter(call.message.author)
			.setColor("BLUE");
		call.safeSend(null, call.message, { embed: memberEmbed });
	}
};
