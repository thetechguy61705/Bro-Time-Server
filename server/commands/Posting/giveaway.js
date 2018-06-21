const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
	id: "giveaway",
	aliases: ["g", "creategivaway"],
	description: "Creates a giveaway in specified channel with specified amount of winners for the specified time.",
	paramsHelp: "(title): (time) (channel) (amount of winners)",
	requires: "Moderator permissions",
	execute: (call) => {
		const GIVEAWAY_PRIZE = call.params.readRaw().split(":")[0];
		if (call.message.member.roles.has("394526142826020874")) {
			if (call.params.readRaw().split(":")[1] !== undefined) {
				var giveawayTime = call.params.readRaw().split(":").slice(1).join(":").split(" ").filter((arg) => arg !== "")[0];
				if (ms(giveawayTime)) {
					if (call.message.mentions.channels.first() !== undefined) {
						giveawayTime = ms(giveawayTime);
						if (giveawayTime > 0 && giveawayTime <= 604800000) {
							var winners = call.params.readRaw().split(":").slice(1).join(":").split(" ").filter((arg) => arg !== "")[2];
							if (!isNaN(parseInt(winners))) {
								if (parseInt(winners) > 0 && parseInt(winners) < 20) {
									winners = Math.round(parseInt(winners));
									var winner;
									const GIVEAWAY_CHANNEL = call.message.mentions.channels.first();
									var giveawayEmbed = new Discord.RichEmbed()
										.setTitle(GIVEAWAY_PRIZE)
										.setDescription(`**React with 🎉 to enter**\nTime remaining: **${giveawayTime.expandPretty()}**`)
										.setColor(0x00AE86)
										.setFooter(`${call.client.user.username} | Giveaway by ${call.message.author.tag}.`);
									GIVEAWAY_CHANNEL.send("🎉 **GIVEAWAY** 🎉", { embed: giveawayEmbed }).then((msg) => {
										call.client.channels.get("457235449417826305")
											.send(`${msg.channel.id} ${msg.id} ${Date.now() + giveawayTime} ${winners} ${call.message.author.id} ${GIVEAWAY_PRIZE}`)
											.then((databaseMesage) => {
												msg.react("🎉");
												var editLoop = setInterval(function() {
													giveawayTime -= 5000;
													if (giveawayTime > 0) {
														giveawayEmbed = new Discord.RichEmbed()
															.setTitle(GIVEAWAY_PRIZE)
															.setDescription(`**React with 🎉 to enter**\nTime remaining: **${giveawayTime.expandPretty()}**`)
															.setColor(0x00AE86)
															.setFooter(`${call.client.user.username} | Giveaway by ${call.message.author.tag}.`);
														msg.edit("🎉 **GIVEAWAY** 🎉", { embed: giveawayEmbed });
													} else {
														msg.reactions.find((r) => r.emoji.name === "🎉").fetchUsers().then((users) => {
															winner = users.filter((r) => r.id !== call.client.user.id && r.id !== call.message.author.id)
																.random(winners);
															if (winner.length === 0) winner = ["**Not enough users entered.**"];
															giveawayEmbed = new Discord.RichEmbed()
																.setTitle(GIVEAWAY_PRIZE)
																.setDescription(`Winner(s): ${winner.join(", ")}`)
																.setColor(0x00AE86)
																.setFooter(`${call.client.user.username} | Giveaway by ${call.message.author.tag}.`);
															msg.edit("🎉 **GIVEAWAY ENDED** 🎉", { embed: giveawayEmbed }).then(() => {
																databaseMesage.delete();
																if (winner[0] !== "**Not enough users entered.**") {
																	msg.channel.send(`${winner.join(", ")} won **${GIVEAWAY_PRIZE}**!`);
																}
															});
															clearInterval(editLoop);
														});
													}
												}, 5000);
											}).catch(() => {
												call.message.reply("There was an error sending the giveaway in that channel.").catch(() => {
													call.message.author
														.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`);
												});
											});
									});
								} else call.safeSend("Please mention a valid amount of winners. Example: `!giveaway title: 10m #giveaways 3`.");
							} else call.safeSend("Please specify a valid amount of winners. Example: `!giveaway title: 10m #giveaways 3`.");
						} else call.safeSend("Please make the giveaway time greater than 10 seconds and less than 7 days. Example: `!giveaway title: 10m #giveaways 3`.");
					} else call.safeSend("Please mention a valid giveaway channel. Example: `!giveaway title: 10m #giveaways 3`.");
				} else call.safeSend("Please specify a valid giveaway time. Example: `!giveaway title: 10m #giveaways 3`.");
			} else call.safeSend("Please specify a valid giveaway title. Example: `!giveaway title: 10m #giveaways 3`.");
		} else call.safeSend("You do not have permissions to use this command. Requires `Role: Giveaways`");
	}
};
