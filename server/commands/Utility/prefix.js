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
			var newPrefix = call.params.readParameter(true);
			if (data != null) {
				if (newPrefix != null && newPrefix.length <= 5) {
					data.setPrefix(newPrefix).then(() => {
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
				} else call.safeSend("Invalid prefix. The prefix must be at least one character and at most five.");

			}
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
