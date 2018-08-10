const { RichEmbed } = require("discord.js");

module.exports = {
	id: "membercount",
	aliases: ["count"],
	description: "Displays the current member count",
	access: "Server",
	exec: function (call) {
		var members = this.members(call.message.guild);
		var memberEmbed = new RichEmbed()
			.addField("Members", members.count)
			.addField("Online", members.online)
			.addField("Humans", members.humans)
			.addField("Bots", members.bots)
			.setDefaultFooter(call.message.author)
			.setColor("BLUE");
		call.safeSend({ embed: memberEmbed });
	},
	members: function (guild) {
		var memberObj = {
			count: guild.memberCount,
			online: guild.members.filter((m) => m.presence.status !== "offline").size,
			humans: guild.members.filter((m) => !m.user.bot).size,
			bots: guild.members.filter((m) => m.user.bot).size
		};
		return memberObj;
	}
};
