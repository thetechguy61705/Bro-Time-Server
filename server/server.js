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
				client.channels.get("436714650835484707").fetchMessages( {limit: 100} ).then(messagesFetched => {
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
									realGuild.members.get(muteUser).removeRole(message.guild.roles.find("name", "Muted")).catch(function() {});
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
					offlineInRole = multiColorRole.members.filter(member => member.presence.status === "offline");
					if (offlineInRole.size !== multiColorRole.members.size) {
						multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]).hexColor).catch(function() {});
						loopNumber = loopNumber + 1;
						if (loopNumber === colors.length) loopNumber = 0;
					}
				}, 1000);
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
