const { RichEmbed } = require("discord.js");
const isModerator = require("app/moderator");

module.exports = {
	id: "prefix",
	description: "Changes the guild's prefix.",
	paramsHelp: "(new prefix)",
	// This command requires the restrictions api. I'll take it out of testing then.
	execute: (call) => {
		if (isModerator(call.message.member)) {
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
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`);
			});
		}
	}
};
