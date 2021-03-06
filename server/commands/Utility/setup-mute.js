const { RichEmbed } = require("discord.js");
const isModerator = require("@utility/moderator");

module.exports = {
	id: "setupmute",
	aliases: ["mutesetup"],
	description: "Denies the send messages permission to each channel for the specified role.",
	paramsHelp: "(mute role)",
	access: "Server",
	exec: (call) => {
		if (isModerator(call.message.author)) {
			var muteRole = call.params.readRole();
			if (muteRole != null) {
				var failedChannels = [];
				call.message.channel.send("Please wait...").then(async (msg) => {
					for (let channel of call.message.guild.channels.array()) {
						if (["text", "category"].includes(channel.type)) {
							try {
								await channel.overwritePermissions(muteRole, { SEND_MESSAGES: false });
							} catch (err) {
								failedChannels.push(channel);
							}
						} else if (channel.type === "voice") {
							try {
								await channel.overwritePermissions(muteRole, { SPEAK: false });
							} catch (err) {
								failedChannels.push(channel);
							}
						}
					}
					if (failedChannels.length <= 0) {
						msg.edit(call.message.author + ", Successfully disabled the `" + muteRole.name + "` from chatting in all text channels and speaking in all voice channels.");
					} else {
						var slicedFailedChannels = failedChannels.slice(0, 20);
						slicedFailedChannels.push(((failedChannels.length - 20) > 0) ? ((failedChannels.length - 20) + " more channels...") : "");
						var failureEmbed = new RichEmbed()
							.setTitle("Failed to change permissions for the following channels:")
							.setDescription(slicedFailedChannels.map((c) => c.name != null ? "`" + c.name + "`" : c).join("\n"))
							.setFooter("This error is most likely because the bot does not have permissions to change channel overwrites for the channel(s).");
						msg.delete();
						call.safeSend({ embed: failureEmbed });
					}
				}).catch((exc) => {
					call.safeSend("Failed to run the setup.");
					console.warn(exc.stack);
				});
			} else call.safeSend("Could not find the role you specified.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
