const Discord = require("discord.js");

module.exports = {
	id: "poll",
	aliases: ["makepoll", "createpoll", "p"],
	load: () => {},
	execute: (call) => {
		const pollTitle = call.params.readRaw().split(":")[0];
		if (call.params.readRaw().split(":")[1] !== undefined) {
			var pollOptions = call.params.readRaw().split(":").slice(1).join(":").split(",");
			if (pollOptions[0] !== "") {
				if (pollOptions.length <= 9 && pollOptions.length >= 2) {
					const eA = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
					pollOptions = pollOptions.map((pollOption, index) => {
						return `${eA[index]} ${pollOption}`;
					});
					const pollEmbed = new Discord.RichEmbed()
						.setTitle(pollTitle)
						.setDescription(pollOptions.join("\n"))
						.setColor(0x00AE86)
						.setFooter(`${call.client.user.username} | Poll by ${call.message.author.tag}.`);
					call.message.channel.send({
						embed: pollEmbed
					}).then(async function(poll) {
						var orderLoop = 0;
						while (orderLoop !== pollOptions.length) {
							await poll.react(eA[orderLoop]);
							orderLoop = orderLoop + 1;
						}
					}).catch(() => {
						call.message.reply("Something went wrong and I could not create the poll.").catch(() => {
							call.message.author
								.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
					});
				} else {
					call.message.reply("Please specify at least 2 and at most 9 poll options. Example: `!poll title: option 1, option 2, option 3`.")
						.catch(() => {
							call.message.author
								.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
				}
			} else {
				call.message.reply("Please specify valid poll options. Example: `!poll title: option 1, option 2, option 3`.").catch(() => {
					call.message.author
						.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("Please specify a valid poll title. Example: `!poll title: option 1, option 2, option 3`.").catch(() => {
				call.message.author
					.send(`You attempted to use the \`poll\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
