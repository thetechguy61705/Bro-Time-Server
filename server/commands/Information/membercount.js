const Discord = require("discord.js");
module.exports = {
	id: "membercount",
	description: "Displays the current member count",
	execute: (call) => {
		var members = call.message.guild.memberCount;
		var online = call.message.guild.members.filter((m) => m.presence.status !== "offline").size;
		var humans = call.message.guild.members.filter((m) => !m.user.bot).size;
		var bots = members - humans;
		var memberEmbed = new Discord.RichEmbed()
			.setColor("BLUE")
			.setFooter(`Ran by ${call.message.author.tag}`)
			.addField("Members", members)
			.addField("Online", online)
			.addField("Humans", humans)
			.addField("Bots", bots);
		call.message.channel.send({ embed: memberEmbed });
	}
};
