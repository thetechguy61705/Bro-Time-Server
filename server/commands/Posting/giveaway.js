/*
Title cannot be > 256 characters because of Discord API limitations.
Giveaways are not permitted to last longer than one month (31 days).
*/

const { RichEmbed } = require("discord.js");
const ms = require("ms");
const UPDATE_INTERVAL_MS = 10000;
const GIVEAWAY_EMOJI = {
	name: "giveaway",
	snowflake: "448305337234096130",
	toString: () => {
		return "<:giveaway:448305337234096130>";
	}
};

module.exports = {
	id: "giveaway",
	aliases: ["g", "creategivaway"],
	description: "Creates a giveaway in specified channel with specified amount of winners for the specified time.",
	paramsHelp: "(prize): (time) (channel) (amount of winners)",
	requires: "Moderator permissions",
	access: "Server",
	botRequires: ["ADD_REACTIONS"],
	botRequiresMessage: "To add the poll emojis.",
	exec: (call) => {
		if (call.message.member.roles.find("name", "Giveaways") != null) {
			var rawContent = call.params.readRaw(),
				title = rawContent.split(":")[0];
			call.params.offset(title.length + 2);
			var time = ms(call.params.readParam() || "."),
				param = call.params.readParam(),
				channel = call.message.guild.channels.find((c) => c.type === "text" && ((param || "").includes(c.id) || c.name.toLowerCase().startsWith(param))),
				amountOfWinners = (call.params.readNumber() || 1);
			if (title.length <= 256) {
				if (time != null && time > UPDATE_INTERVAL_MS && time < 2678400000) {
					if (channel != null && channel.type === "text") {
						var giveawayEmbed = new RichEmbed()
							.setTitle(title)
							.setDescription(`**React with ${GIVEAWAY_EMOJI} to enter**\nTime remaining: **${time.expandPretty()}**`)
							.setColor(0x00AE86)
							.setFooter(call.client.user.username + "| " + amountOfWinners + " winner(s)" + " |")
							.setDefaultFooter(call.message.author);
						channel.send("🎉 **GIVEAWAY** 🎉", { embed: giveawayEmbed }).then(async (msg) => {
							var areaLoadMessage = await call.client.channels.get("457235449417826305")
								.send(`${msg.channel.id} ${msg.id} ${Date.now() + time} ${amountOfWinners} ${call.message.author.id} ${title}`);
							msg.react(GIVEAWAY_EMOJI.snowflake);
							var updateLoop = call.client.setInterval(async () => {
								if (time <= 0) {
									var users = await msg.reactions.get(GIVEAWAY_EMOJI.name + ":" + GIVEAWAY_EMOJI.snowflake).fetchUsers(msg.guild.memberCount);
									users = users.filter((user) => !user.bot && user.id !== call.message.author.id);
									var winners = users.random(amountOfWinners);
									if (!Array.isArray(winners)) winners = (winners != null) ? [winners] : [];
									else winners = winners.filter((winner) => winner != null);

									if (winners.length > 0) {
										msg.channel.send(`${winners.join(", ")} won **${title}**!`);
										giveawayEmbed.setDescription(`Winner(s): ${winners.join(", ")}.`);
									} else {
										msg.channel.send("Giveaway ended, not enough people entered. :(");
										giveawayEmbed.setDescription("Giveaway ended, not enough people entered. :(");
									}
									areaLoadMessage.delete();
									call.client.clearInterval(updateLoop);
								}
								msg.edit("🎉 **GIVEAWAY** 🎉", { embed: giveawayEmbed });
								time -= UPDATE_INTERVAL_MS;
								giveawayEmbed.setDescription(`**React with ${GIVEAWAY_EMOJI} to enter**\nTime remaining: **${time.expandPretty()}**`);
							}, UPDATE_INTERVAL_MS);
						}).catch(() => {
							call.safeSend("I failed to send the giveaway to the given channel. Please try again.");
						});
					} else call.safeSend("Please specify a valid channel to host the giveaway in. You must be able to see this channel. Example: `!giveaway title: 10m #giveaways 3.`");
				} else call.safeSend("Please specify a valid amount of time greater than 5 seconds and less than 31 days. Example: `!giveaway title: 10m #giveaways 3.`");
			} else call.safeSend("The amount of characters in the title cannot be greater than 240. Example: `!giveaway title: 10m #giveaways 3.`");
		} else call.safeSend("You cannot run this command unless you have the `Giveaways` role.");
	}
};
