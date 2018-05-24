var errorHandler = require("app/errorHandler");
var config = require("../config");
var fs = require("fs");
var discord = require("discord.js");
var loaders = [];
var chatHandlers = [];
var client = new discord.Client(config.CLIENT);

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
	for (var handler of chatHandlers) {
		try {
			if (handler.exec(message, client))
				break;
		} catch (exc) {
			console.warn("Failed to handle chat message:");
			console.warn(exc.stack);
		}
	}
});

client.login(config.TOKEN);

process.on("SIGTERM", async () => {
	await client.destroy();
});
