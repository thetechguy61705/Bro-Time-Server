var config = require("../config");
var fs = require("fs");
var discord = require("discord.js");

var loaders = [];
var chatHandlers = [];

fs.readdirSync(__dirname + "/load").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null)
		loaders.push(require("./load/" + match[1]));
});
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
config.TOKENS.forEach(token => {
	let client = new discord.Client();

	client.on("ready", () => {
		console.log("Loading " + client.user.username);
		loaders.forEach(loader => {
			loader.exec(client);
		});
		console.log("Finished loading " + client.user.username);
	});

	client.on("message", message => {
		for (var i = 0; i < chatHandlers.length; i++) {
			if (chatHandlers[i].exec(message, client))
				break;
		}
	});

	client.login(token);
});
