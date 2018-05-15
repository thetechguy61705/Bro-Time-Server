const Discord = require("discord.js");

module.exports = {
	exec: (client) => {
		if (client.user.id === "393532251398209536") {
			client.channels.get("436714650835484707").fetchMessages({ limit: 100 }).then(messagesFetched => {
				var muteUser;
				var timeUntilUnmute;
				messagesFetched.forEach(msg => {
					if (msg.author.id === "393532251398209536") {
						muteUser = msg.content.split(" ")[0];
						timeUntilUnmute = parseInt(msg.content.split(" ")[1]);
						if (timeUntilUnmute <= Date.now()) {
							msg.delete().catch(function() {});
							realGuild.members.get(muteUser).removeRole(realGuild.roles.find("name", "Muted")).catch(function() {});
						} else {
							setTimeout(() => {
								realGuild.members.get(muteUser).removeRole(realGuild.roles.find("name", "Muted")).catch(function() {});
								msg.delete().catch(function() {});
							}, timeUntilUnmute - Date.now());
						}
					}
				});
			});
		}

		if (client.user.id === "393532251398209536") {
			const Discord = require("discord.js");
			client.channels.get("437091372538003456").fetchMessages({ limit: 100 }).then(messagesFetched => {
				var giveawayChannel;
				var giveawayID;
				var giveawayEnd;
				var giveawayWinners;
				var giveawayAuthor;
				var giveawayPrize;
				messagesFetched.forEach(msg => {
					if (msg.author.id === "393532251398209536") {
						var msgargs = msg.content.split(" ");
						giveawayChannel = msgargs[0];
						giveawayID = msgargs[1];
						giveawayEnd = parseInt(msgargs[2]) - Date.now();
						giveawayWinners = parseInt(msgargs[3]);
						giveawayAuthor = client.users.get(msgargs[4]).tag;
						giveawayPrize = msgargs.slice(5).join(" ");
						if (giveawayEnd > 0) {
							client.channels.get(giveawayChannel).fetchMessage(giveawayID).then(giveawayMessage => {
								var editLoop = setInterval(function() {
									var giveawayEmbed;
									giveawayEnd = giveawayEnd - 5000;
									var hours = (((giveawayEnd) - (giveawayEnd % 3600000)) / 3600000);
									var minutes = ((giveawayEnd % 3600000) - (giveawayEnd % 3600000) % (60000)) / 60000;
									var seconds = ((giveawayEnd % 3600000) % 60000) - (((giveawayEnd % 3600000) % 60000) % 1000);
									var totalTime = `\`${hours}\` hours, \`${minutes}\` minutes, \`${seconds/1000}\` seconds`;
									if (giveawayEnd > 0) {
										giveawayEmbed = new Discord.RichEmbed()
											.setTitle(giveawayPrize)
											.setDescription(`**React with 🎉 to enter**\nTime remaining: **${totalTime}**`)
											.setColor(0x00AE86)
											.setFooter(`${client.user.username} | Giveaway by ${giveawayAuthor}.`);
										giveawayMessage.edit("🎉 **GIVEAWAY** 🎉", {
											embed: giveawayEmbed
										});
									} else {
										giveawayMessage.reactions.find(r => r.emoji.name === "🎉").fetchUsers().then(users => {
											var winner = users.filter(r => r.id !== client.user.id && r.id !== giveawayAuthor.id).random(giveawayWinners);
											if (winner.length === 0) winner = ["**Not enough users entered.**"];
											giveawayEmbed = new Discord.RichEmbed()
												.setTitle(giveawayPrize)
												.setDescription(`Winner(s): ${winner.join(", ")}`)
												.setColor(0x00AE86)
												.setFooter(`${client.user.username} | Giveaway by ${giveawayAuthor}.`);
											giveawayMessage.edit("🎉 **GIVEAWAY ENDED** 🎉", {
												embed: giveawayEmbed
											}).then(() => {
												msg.delete().catch(function() {});
												if (winner[0] !== "**Not enough users entered.**") {
													giveawayMessage.channel.send(`${winner.join(", ")} won **${giveawayPrize}**!`).catch(function() {});
												}
											}).catch(function() {});
											clearInterval(editLoop);
										});
									}
								}, 5000);
							});
						} else {
							client.channels.get(giveawayChannel).fetchMessage(giveawayID).then(giveawayMessage => {
								giveawayMessage.reactions.find(r => r.emoji.name === "🎉").fetchUsers().then(users => {
									var winner = users.filter(r => r.id !== client.user.id && r.id !== giveawayAuthor.id).random(giveawayWinners);
									if (winner.length === 0) winner = ["**Not enough users entered.**"];
									var giveawayEmbed = new Discord.RichEmbed()
										.setTitle(giveawayPrize)
										.setDescription(`Winner(s): ${winner.join(", ")}`)
										.setColor(0x00AE86)
										.setFooter(`${client.user.username} | Giveaway by ${giveawayAuthor}.`);
									giveawayMessage.edit("🎉 **GIVEAWAY ENDED** 🎉", {
										embed: giveawayEmbed
									}).then(() => {
										msg.delete().catch(function() {});
										if (winner[0] !== "**Not enough users entered.**") {
											giveawayMessage.channel.send(`${winner.join(", ")} won **${giveawayPrize}**!`).catch(function() {});
										}
									}).catch(function() {});
								});
							});
						}
					}
				});
			});
		}
	}
};
