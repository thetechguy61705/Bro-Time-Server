var config = require("../config");
var fs = require("fs");
var discord = require("discord.js");

var loaders = [];
var areaLoaders = [];
var chatHandlers = [];

fs.readdirSync(__dirname + "/chat").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then(handler => {
			chatHandlers.push(handler);
		}, exc => {
			console.warn("A chat handler failed to load: %s (reason: %s)", match[1], exc);
		});
	}
});
fs.readdirSync(__dirname + "/load").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null)
		loaders.push(require("./load/" + match[1]));
});
fs.readdirSync(__dirname + "/areaLoad").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null)
		areaLoaders.push(require("./areaLoad/" + match[1]));
});
config.TOKENS.forEach(token => {
	let client = new discord.Client();
	let loadedAreas = new discord.Collection();

	client.on("ready", () => {
		console.log("Loading " + client.user.username);
		loaders.forEach(loader => {
			loader.exec(client);
		});
		console.log("Finished loading " + client.user.username);
	});

	client.on("message", message => {
		let area = message.channel.guild || message.channel;
		if (!loadedAreas.has(area.id)) {
			loadedAreas.set(area.id, true);
			areaLoaders.forEach(loader => {
				loader.exec(area, client);
			});
		}
		for (var i = 0; i < chatHandlers.length; i++) {
			if (chatHandlers[i].exec(message, client))
				break;
		}
	});

	client.login(token);
	
	// TODO: Connect to SIGTERM to destroy the client (I'm tired of waiting for the client to timeout while testing).
	process.on("SIGTERM", async () => {
		await client.destroy();
	});
});
