const { RichEmbed } = require("discord.js");

function channelMap(channels, type, member) {
	return channels.filter((channel) => channel.type === type && channel.permissionsFor(member).has("READ_MESSAGES")).map((channel) => channel.name);
}

function andMore(desired, amount) {
	var result = "";
	if (desired < amount) result = `\nAnd ${amount - desired} more...`;
	return result;
}

module.exports = {
	id: "serverinfo",
	aliases: ["infoserver", "si"],
	description: "Displays information on the current server.",
	access: "Server",
	exec: (call) => {
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
			.addField("Text Channels", `\`${channelMap(guild.channels, "text", call.message.member).slice(0, 15).join("`, `")}\`` +
				andMore(15, channelMap(guild.channels, "text", call.message.member).length))
			.addField("Voice Channels", `\`${channelMap(guild.channels, "voice", call.message.member).slice(0, 15).join("`, `")}\`` +
				andMore(15, channelMap(guild.channels, "voice", call.message.member).length))
			.addField("Category Channels", `\`${channelMap(guild.channels, "category", call.message.member).slice(0, 15).join("`, `")}\`` +
				andMore(15, channelMap(guild.channels, "category", call.message.member).length))
			.addField("Members", `Members: \`${members.count}\`\n` +
				`Online: \`${members.online}\`\n` +
				`Humans: \`${members.humans}\`\n` +
				`Bots: \`${members.bots}\``)
			.addField("Roles", guild._sortedRoles.array().reverse().map((role) => `${role} (${role.members.size})`).slice(0, 35).join(",\n") +
				andMore(35, guild._sortedRoles.size))
			.addField("Emojis", guild.emojis.map((emoji) => emoji.toString()).slice(0, 20).join("  ") +
				andMore(20, guild.emojis.size), true)
			.setDefaultFooter(call.message.author);
		call.safeSend(null, call.message, { embed: serverEmbed });
	}
};
