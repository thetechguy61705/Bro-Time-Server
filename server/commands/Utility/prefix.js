const { RichEmbed } = require("discord.js");

module.exports = {
	id: "prefix",
	description: "Changes the guild's prefix.",
	paramsHelp: "(new prefix)",
	// This command requires the restrictions api. I'll take it out of testing then.
	test: true,
	execute: (call) => {
		var data = (call.message.guild || call.message.channel).data;
		if (data != null) {
			data.setPrefix(call.params.readParameter(true)).then((newPrefix) => {
				call.message.channel.send(new RichEmbed()
					.setTitle("Prefix Changed")
					.setDescription(`The prefix is now set to \`${newPrefix}\`!`));
			}, (exc) => {
				console.warn("Unable to set prefix:");
				console.warn(exc.stack);
				call.message.channel.send("Unable to change the prefix!");
			});
		}
	}
};
