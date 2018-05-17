const Discord = require("discord.js");
const ms = require("ms");

module.exports = {
	id: "giveaway",
	aliases: ["g", "creategivaway"],
	description: "Creates a giveaway in specified channel with specified amount of winners for the specified time.",
	arguments: "(title): (time) (channel) (amount of winners)",
	requires: "Moderator permissions",
	execute: (call) => {
		var giveawayPrize = call.params.readRaw().split(":")[0];
		if (call.message.member.roles.has("394526142826020874")) {
			if (call.params.readRaw().split(":")[1] !== undefined) {
				var giveawayTime = call.params.readRaw().split(":").slice(1).join(":").split(" ").filter(arg => arg !== "")[0];
				if (ms(giveawayTime)) {
					if (call.message.mentions.channels.first() !== undefined) {
						giveawayTime = ms(giveawayTime);
						if (giveawayTime > 0 && giveawayTime <= 604800000) {
							var winners = call.params.readRaw().split(":").slice(1).join(":").split(" ").filter(arg => arg !== "")[2];
							if (!isNaN(parseInt(winners))) {
								if (parseInt(winners) > 0 && parseInt(winners) < 20) {
									winners = Math.round(parseInt(winners));
									var winner;
									var hours = (((giveawayTime) - (giveawayTime % 3600000)) / 3600000);
									var minutes = ((giveawayTime % 3600000) - (giveawayTime % 3600000) % (60000)) / 60000;
									var seconds = ((giveawayTime % 3600000) % 60000) - (((giveawayTime % 3600000) % 60000) % 1000);
									var totalTime = `\`${hours}\` hours, \`${minutes}\` minutes, \`${seconds/1000}\` seconds`;
									var giveawayChannel = call.message.mentions.channels.first();
									var giveawayEmbed = new Discord.RichEmbed()
										.setTitle(giveawayPrize)
										.setDescription(`**React with 🎉 to enter**\nTime remaining: **${totalTime}**`)
										.setColor(0x00AE86)
										.setFooter(`${call.client.user.username} | Giveaway by ${call.message.author.tag}.`);
									giveawayChannel.send("🎉 **GIVEAWAY** 🎉", {
										embed: giveawayEmbed
									}).then(msg => {
										var giveawayEmbed;
										call.client.channels
											.get("437091372538003456")
											.send(`${msg.channel.id} ${msg.id} ${Date.now() + giveawayTime} ${winners} ${call.message.author.id} ${giveawayPrize}`)
											.then(databaseMesage => {
												msg.react("🎉").catch(function() {});
												var editLoop = setInterval(function() {
													giveawayTime = giveawayTime - 5000;
													hours = (((giveawayTime) - (giveawayTime % 3600000)) / 3600000);
													minutes = ((giveawayTime % 3600000) - (giveawayTime % 3600000) % (60000)) / 60000;
													seconds = ((giveawayTime % 3600000) % 60000) - (((giveawayTime % 3600000) % 60000) % 1000);
													totalTime = `\`${hours}\` hours, \`${minutes}\` minutes, \`${seconds/1000}\` seconds`;
													if (giveawayTime > 0) {
														giveawayEmbed = new Discord.RichEmbed()
															.setTitle(giveawayPrize)
															.setDescription(`**React with 🎉 to enter**\nTime remaining: **${totalTime}**`)
															.setColor(0x00AE86)
															.setFooter(`${call.client.user.username} | Giveaway by ${call.message.author.tag}.`);
														msg.edit("🎉 **GIVEAWAY** 🎉", {
															embed: giveawayEmbed
														});
													} else {
														msg.reactions.find(r => r.emoji.name === "🎉").fetchUsers().then(users => {
															winner = users.filter(r => r.id !== call.client.user.id && r.id !== call.message.author.id)
																.random(winners);
															if (winner.length === 0) winner = ["**Not enough users entered.**"];
															giveawayEmbed = new Discord.RichEmbed()
																.setTitle(giveawayPrize)
																.setDescription(`Winner(s): ${winner.join(", ")}`)
																.setColor(0x00AE86)
																.setFooter(`${call.client.user.username} | Giveaway by ${call.message.author.tag}.`);
															msg.edit("🎉 **GIVEAWAY ENDED** 🎉", {
																embed: giveawayEmbed
															}).then(() => {
																databaseMesage.delete().catch(function() {});
																if (winner[0] !== "**Not enough users entered.**") {
																	msg.channel.send(`${winner.join(", ")} won **${giveawayPrize}**!`).catch(function() {});
																}
															}).catch(function() {});
															clearInterval(editLoop);
														});
													}
												}, 5000);
											}).catch(() => {
												call.message.reply("There was an error sending the giveaway in that channel.").catch(() => {
													call.message.author
														.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`)
														.catch(function() {});
												});
											});
									});
								} else {
									call.message.reply("Please mention a valid amount of winners. Example: `!giveaway title: 10m #giveaways 3`.").catch(() => {
										call.message.author
											.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`)
											.catch(function() {});
									});
								}
							} else {
								call.message.reply("Please specify a valid amount of winners. Example: `!giveaway title: 10m #giveaways 3`.")
									.catch(() => {
										call.message.author
											.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`)
											.catch(function() {});
									});
							}
						} else {
							call.message
								.reply("Please make the giveaway time greater than 10 seconds and less than 7 days. Example: `!giveaway title: 10m #giveaways 3`.")
								.catch(() => {
									call.message.author
										.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`)
										.catch(function() {});
								});
						}
					} else {
						call.message.reply("Please mention a valid giveaway channel. Example: `!giveaway title: 10m #giveaways 3`.").catch(() => {
							call.message.author
								.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`)
								.catch(function() {});
						});
					}
				} else {
					call.message.reply("Please specify a valid giveaway time. Example: `!giveaway title: 10m #giveaways 3`.").catch(() => {
						call.message.author.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				call.message.reply("Please specify a valid giveaway title. Example: `!giveaway title: 10m #giveaways 3`.").catch(() => {
					call.message.author.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to use this command. Requires `Role: Giveaways`").catch(() => {
				call.message.author.send(`You attempted to use the \`giveaway\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
