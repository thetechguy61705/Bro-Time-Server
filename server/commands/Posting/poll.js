const { RichEmbed } = require("discord.js");
const EMOJI_ARRAY = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];

module.exports = {
	id: "poll",
	aliases: ["makepoll", "createpoll", "p"],
	description: "Sends a rich embed in the channel it was triggered with specified title and poll options" +
		", then reacts to the rich embed correspondingly to the poll options.",
	paramsHelp: "(title): (option) | (option)",
	execute: (call) => {
		const pollTitle = call.params.readRaw().split(":")[0];
		if (call.params.readRaw().split(":")[1] !== undefined) {
			var pollOptions = call.params.readRaw().split(":").slice(1).join(":").split("|");
			if (pollOptions[0] !== "") {
				if (pollOptions.length <= 9 && pollOptions.length >= 2) {
					pollOptions = pollOptions.map((pollOption, i) => EMOJI_ARRAY[i] + " " + pollOption.trim());
					const POLL_EMBED = new RichEmbed()
						.setTitle(pollTitle)
						.setDescription(pollOptions.join("\n"))
						.setColor(0x00AE86)
						.setFooter(`${call.client.user.username} | Poll by ${call.message.author.tag}.`);
					call.message.channel.send({ embed: POLL_EMBED }).then((poll) => {
						poll.reactMultiple(EMOJI_ARRAY.slice(0, pollOptions.length));
					}).catch(() => {
						call.message.reply("Something went wrong and I could not create the poll.").catch(() => {
							call.message.author
								.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
					});
				} else {
					call.message.reply("Please specify at least 2 and at most 9 poll options. Example: `!poll title: option 1 | option 2 | option 3`.")
						.catch(() => {
							call.message.author
								.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
				}
			} else {
				call.message.reply("Please specify valid poll options. Example: `!poll title: option 1 | option 2 | option 3`.").catch(() => {
					call.message.author
						.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("Please specify a valid poll title. Example: `!poll title: option 1 | option 2 | option 3`.").catch(() => {
				call.message.author
					.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
