const { RichEmbed } = require("discord.js");
function channelMap(channels, type) {
	return "`" + channels.filter((channel) => channel.type === type).map((channel) => channel.name).join("`, `") + "`";
}

module.exports = {
	id: "serverinfo",
	aliases: ["infoserver", "si"],
	description: "Displays information on the current server.",
	access: "Server",
	execute: (call) => {
		var guild = call.message.guild;
		var members = require("./membercount").members(guild);
		var serverEmbed = new RichEmbed()
			.setTitle("Information about " + guild.name)
			.setColor(0x00AE86)
			.setThumbnail(guild.iconURL)
			.addField("Name", guild.name, true)
			.addField("ID", guild.id, true);
		if (guild.iconURL == null) serverEmbed.addBlankField(true);
		serverEmbed.addField("Channel Count", guild.channels.size, true)
			.addField("Created At", guild.createdAt.toString().substring(0, 15), true);
		if (guild.iconURL == null) serverEmbed.addBlankField(true);
		serverEmbed.addField("Icon", `${guild.iconURL != null ? `URL(${guild.iconURL})` : "None."}`, true)
			.addField("Region", guild.region, true);
		if (guild.iconURL == null) serverEmbed.addBlankField(true);
		serverEmbed.addField("Owner", guild.owner.user.toString())
			.addField("Text Channels", channelMap(guild.channels, "text"))
			.addField("Voice Channels", channelMap(guild.channels, "voice"))
			.addField("Category Channels", channelMap(guild.channels, "category"))
			.addField("Members", `Members: \`${members.count}\`\n` +
				`Online: \`${members.online}\`\n` +
				`Humans: \`${members.humans}\`\n` +
				`Bots: \`${members.bots}\``)
			.addField("Roles", guild._sortedRoles.array().reverse().map((role) => `${role} (${role.members.size})`).slice(0, 35).join(",\n") +
				("\nAnd " + (guild.roles.size - 35) + " more..."))
			.setDefaultFooter(call.message.author);
		call.safeSend(null, call.message, { embed: serverEmbed });
	}
};
