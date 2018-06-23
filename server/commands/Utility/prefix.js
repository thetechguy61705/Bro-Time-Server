const { RichEmbed } = require("discord.js");
const isModerator = require("app/moderator");

module.exports = {
	id: "prefix",
	description: "Changes the guild's prefix.",
	paramsHelp: "(new prefix)",
	access: "Public",
	execute: (call) => {
		if (isModerator(call.message.member)) {
			var data = (call.message.guild || call.message.channel).data;
			if (data != null) {
				data.setPrefix(call.params.readParameter(true)).then((newPrefix) => {
					call.message.channel.send(new RichEmbed()
						.setTitle("Prefix Changed")
						.setDescription(`The prefix is now set to \`${newPrefix}\`!`)
						.setDefaultFooter(call.message.author)
						.setColor(0x00AE86),
					);
				}, (exc) => {
					console.warn("Unable to set prefix:");
					console.warn(exc.stack);
					call.safeSend("Failed to set the prefix.");
				});
			}
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
