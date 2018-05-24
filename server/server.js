var errorHandler = require("app/errorHandler");
var config = require("../config");
var fs = require("fs");
var discord = require("discord.js");
var loaders = [];
var areaLoaders = [];
var chatHandlers = [];
var client = new discord.Client(config.CLIENT);
var loadedAreas = new discord.Collection();

fs.readdirSync(__dirname + "/chat").forEach(file => {
	if (file.endsWith(".js")) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + file));
			} catch (exc) {
				reject(exc);
			}
		}).then(handler => {
			chatHandlers.push(handler);
		}, exc => {
			console.warn(`Unable to load chat module ${file}:`);
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
	if (file.endsWith(".js"))
		areaLoaders.push(require("./areaLoad/" + file));
});

errorHandler(client);

client.on("ready", () => {
	// eslint-disable-next-line no-console
	console.log("Loading...");
	loaders.forEach(loader => {
		if (loader.exec != null)
			loader.exec(client);
	});
	// eslint-disable-next-line no-console
	console.log("Finished loading!");
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

client.login(config.TOKEN);

process.on("SIGTERM", async () => {
	await client.destroy();
});
