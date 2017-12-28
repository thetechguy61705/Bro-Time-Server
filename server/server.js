var discord = require("discord.js");
var client = new discord.Client();
var chatHandlers = [];

var CHAT = ["greeting", "commands"];

client.on("ready", () => {
	CHAT.forEach(name => {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + name));
			} catch (exc) {
				reject(exc);
			}
		}).then(handler => {
			chatHandlers.push(handler);
		}, exc => {
			console.warn("A chat handler failed to load: %s (reason: %s)", name, exc);
		});
	});
});

client.on("message", message => {
	for (var i = 0; i < chatHandlers.length; i++)
	{
		if (chatHandlers[i](message, client))
			break;
	}
});

client.login(process.env.BRO_TIME_TOKEN);
