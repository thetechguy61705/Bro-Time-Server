const { RichEmbed } = require("discord.js");

module.exports = {
	id: "channelinfo",
	aliases: ["channelinformation", "infochannel"],
	description: "Displays information on the specified channel.",
	paramsHelp: "(channel)",
	access: "Server",
	execute: async (call) => {
		var channel = call.params.readChannel();
		if (channel != null) {
			var infoEmbed = new RichEmbed()
				.setTitle("Information on " + channel.name)
				.setColor(0x00AE86)
				.addField("Name", "`" + channel.name + "`", true)
				.addField("Mention", channel.toString(), true)
				.addField("ID", channel.id, true)
				.addField("Parent Channel", "`" + (channel.parent || { name: "none" }).name + "`", true)
				.addField("Created At", channel.createdAt.toString().substring(0, 15), true)
				.addField("Position", channel.position.toString(), true)
				.addField("Type", channel.type.toString(), true);
			if (channel.type === "text") {
				infoEmbed.addField("Topic", channel.topic || "none", true)
					.addField("NSFW", channel.nsfw.toString(), true);
			} else if (channel.type === "voice") {
				infoEmbed.addField("User Limit", channel.userLimit.toString(), true)
					.addField("Users", channel.members.size.toString(), true)
					.addField("Bitrate", channel.bitrate.toString(), true)
					.addField("Full", channel.full.toString(), true);
			} else if (channel.type === "category") {
				infoEmbed.addField("Children", channel.children.size <= 0 ? "none" : "`" + channel.children.map((child) => child.name).join("`, `") + "`");
			}
			infoEmbed.setDefaultFooter(call.message.author);
			call.safeSend(null, call.message, { embed: infoEmbed });
		} else call.safeSend("You did not specify a valid channel.");
	}
};
