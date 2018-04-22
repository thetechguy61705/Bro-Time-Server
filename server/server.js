var errorHandler = require("app/errorHandler");
var config = require("../config");
var fs = require("fs");
var discord = require("discord.js");
var loaders = [];
var areaLoaders = [];
var chatHandlers = [];
fs.readdirSync(__dirname + "/chat").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match != null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then(handler => {
			chatHandlers.push(handler);
		}, exc => {
			console.warn(`Unable to load chat module ${match}:`);
			console.warn(exc.stack);
		});
	}
});
fs.readdirSync(__dirname + "/load").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match != null)
		loaders.push(require("./load/" + match[1]));
});
fs.readdirSync(__dirname + "/areaLoad").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match != null)
		areaLoaders.push(require("./areaLoad/" + match[1]));
});
for (let token in config.BOTS) {
	if (token !== "undefined") {
		let settings = config.BOTS[token];
		let client = new discord.Client();
		let loadedAreas = new discord.Collection();

		errorHandler(client);
		client.setMaxListeners(30);

		client.on("ready", () => {
			const realGuild = client.guilds.get("330913265573953536");
			console.log("Loading " + client.user.username);
			loaders.forEach(loader => {
				loader.exec(client, settings);
			});
			console.log("Finished loading " + client.user.username);

			if (client.user.id === "393532251398209536") {
				client.channels.get("436714650835484707").fetchMessages({
					limit: 100
				}).then(messagesFetched => {
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
				const multiColorRole = realGuild.roles.find("name", "Multicolored");
				const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Pink", "Yellow", "HotPink",
					"Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
					"DarkViolet", "Gold"
				];
				var loopNumber = 0;
				var offlineInRole;
				setInterval(function() {
					if(require("./commands/togglecolor.js").module.exports.multicolor) {
						offlineInRole = multiColorRole.members.filter(member => member.presence.status === "offline");
						if (offlineInRole.size !== multiColorRole.members.size) {
							multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]).hexColor).catch(function() {});
							loopNumber = loopNumber + 1;
							if (loopNumber === colors.length) loopNumber = 0;
						}
					}
				}, 1000);
			}

			if (client.user.id === "393532251398209536") {
				const Discord = require("discord.js");
				client.channels.get("437091372538003456").fetchMessages({
					limit: 100
				}).then(messagesFetched => {
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

		});

		client.on("message", message => {
			if (!message.author.bot) {
				var area = message.channel.guild || message.channel;
				var isServer = !(area instanceof discord.Channel);
				var task = () => {
					if (isServer)
						loadedAreas.set(area.id, true);
					message.data = area.data;
					// Process the message.
					for (var i = 0; i < chatHandlers.length; i++) {
						try {
							if (chatHandlers[i].exec(message, client))
								break;
						} catch (exc) {
							console.warn("Failed to handle chat message:");
							console.warn(exc.stack);
						}
					}
				};
				// Load area data.
				if (!isServer || !loadedAreas.has(area.id)) {
					let promises = [];
					for (var i = 0; i < areaLoaders.length; i++)
						promises.push(areaLoaders[i].exec(area, client));
					Promise.all(promises).then(task).catch((exc) => {
						console.warn(`Unable to load area ${area.id}:`);
						console.warn(exc.stack);
						message.reply("Unable to load. Retry in a few seconds.");
						if (isServer)
							loadedAreas.delete(area.id);
					});
				} else {
					task();
				}
			}
		});

		client.login(token);

		process.on("SIGTERM", async () => {
			await client.destroy();
		});
	} else {
		console.log("Skipped missing token.");
	}
}
