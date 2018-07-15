import { RichEmbed, TextChannel, Message } from "discord.js";
import { ICommand, Call } from "@server/chat/commands.ts";
import { INVITE_REGEX, MARKDOWN } from "@server/chat/filter.js";

module.exports = {
	id: "suggest",
	description: "Used to suggest ideas for the current server",
	paramsHelp: "(idea)",
	access: "Server",
	cooldown: [],
	execute: (call: Call) => {
		var suggestionChannel = call.message.guild.channels
			.find((c) => {
				return c.name === "suggestions" && c.type === "text" && c.permissionsFor(call.message.guild.me).has(["READ_MESSAGES", "SEND_MESSAGES", "EMBED_LINKS"]);
			}) as TextChannel;
		if (suggestionChannel != null) {
			if (module.exports.cooldown.indexOf(call.message.author.id) === -1) {
				var rawContent = call.params.readRaw(),
					title = rawContent.split(":")[0],
					suggestion = rawContent.split(":")[1];
				if (title && suggestion && title.length <= 256 && suggestion.length <= 500) {
					const suggestionEmbed = new RichEmbed()
						.setColor(0x00AE86)
						.setTitle(title)
						.setDescription(suggestion)
						.setFooter(`${call.client.user.username} | Suggestion by ${call.message.author.tag} (${call.message.author.id})`,
							call.message.author.displayAvatarURL);
					if (!INVITE_REGEX.test(suggestionEmbed.title.replace(MARKDOWN, "")) && !INVITE_REGEX.test(suggestionEmbed.description.replace(MARKDOWN, ""))) {
						module.exports.cooldown.push(call.message.author.id);
						suggestionChannel.send({ embed: suggestionEmbed }).then((msg: Message) => {
							msg.reactMultiple(["👍", "👎"]);
							call.message.channel.send({ embed: new RichEmbed()
								.setTitle("Sent")
								.setURL(`https://discordapp.com/channels/${suggestionChannel.guild.id}/${suggestionChannel.id}/${msg.id}`)
								.setColor("GREEN")
							}).catch((exc: Error) => {
								console.warn("Failed sending embed:");
								console.warn(exc.stack);
							});
							call.client.setTimeout(() => {
								module.exports.cooldown.splice(module.exports.cooldown.indexOf(call.message.author.id), 1);
							}, 3600000);
						}).catch((exc: Error) => {
							call.safeSend("Failed to send the suggestion.");
							module.exports.cooldown.splice(module.exports.cooldown.indexOf(call.message.author.id), 1);
							console.warn("Failed sending suggestionEmbed:");
							console.warn(exc.stack);
						});
					} else call.safeSend("Your suggestion contains an invite link (fake or not). Please avoid using invite links in suggestions");
				} else call.safeSend("Please specify a title (256 chars or less) and a description of your suggestion (500 chars or less)." +
					" Example: `!suggest Hello Command: Replies saying Hello @user! to you.`.");
			} else call.safeSend("Please wait 60 minutes before sending another suggestion.");
		} else call.safeSend("This guild has no channel named `suggestions` that the client has permission to post embed links, send, and read messages.");
	}
} as ICommand;
