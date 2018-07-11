const { RichEmbed } = require("discord.js");

module.exports = {
	id: "emojiinfo",
	aliases: ["emojiinformation", "infoemoji"],
	description: "Displays information on the specified custom emoji.",
	paramsHelp: "(emoji)",
	access: "Server",
	execute: (call) => {
		var param = (call.params.readParam(true) || "").toLowerCase();
		var emoji = call.message.guild.emojis.find((emoji) => emoji.toString().toLowerCase() === param || emoji.name.toLowerCase().startsWith(param));
		if (emoji != null) {
			var infoEmbed = new RichEmbed()
				.setTitle("Information on " + emoji.name)
				.setColor(0x00AE86)
				.addField("Name", emoji.name, true)
				.addField("Emoji", emoji.toString(), true)
				.addField("ID", emoji.id, true)
				.addField("Created At", emoji.createdAt.toString().substring(0, 15), true)
				.addField("Automated", emoji.managed.toString(), true)
				.addField("Animated", emoji.animated.toString(), true)
				.addField("Roles", emoji.roles.size <= 0 ? "all" : "`" + emoji.roles.map((role) => role.name).join("`, `") + "`", true)
				.addField("Image", `[URL](${emoji.url})`, true)
				.addField("Needs Colons", emoji.requiresColons, true)
				.setThumbnail(emoji.url);
			infoEmbed.setDefaultFooter(call.message.author);
			call.safeSend(null, call.message, { embed: infoEmbed });
		} else call.safeSend("You did not specify a valid emoji.");
	}
};
