var errorHandler = require("app/errorHandler");
var config = require("../config");
var fs = require("fs");
var discord = require("discord.js");
var clients = new discord.Collection();
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
	if (file.endsWith(".js")) {
		loaders.push(require("./load/" + file));
	}
});

fs.readdirSync(__dirname + "/areaLoad").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match != null)
		areaLoaders.push(require("./areaLoad/" + match[1]));
});

config.BOTS.forEach((bot) => {
	if (bot.token != null) {
		let client = new discord.Client({ fetchAllMembers: true });
		let loadedAreas = new discord.Collection();

		errorHandler(client);

		client.on("ready", () => {
			// eslint-disable-next-line no-console
			console.log("Loading " + client.user.username);
			clients.set(client.user.id, client);
			loaders.forEach(loader => {
				if (loader.exec != null)
					loader.exec(client, bot);
			});
			// eslint-disable-next-line no-console
			console.log("Finished loading " + client.user.username);
		});

		client.on("message", message => {
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
		});

		client.login(bot.token);

		process.on("SIGTERM", async () => {
			await client.destroy();
		});
	} else {
		console.warn("Skipped missing token.");
	}
});

module.exports = clients;
