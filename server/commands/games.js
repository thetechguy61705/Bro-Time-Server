var fs = require("fs");
var { Collection } = require("discord.js");
var modules = new Collection();

fs.readdirSync(__dirname + "/../games").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match != null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("../games/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then(module => {
			modules.push(module);
		}, exc => {
			console.warn(`Unable to load game module ${match}:`);
			console.warn(exc.stack);
		});
	}
});

function collectUsers(params) {
	var user;
	var users = [];

	do {
		user = params.readUser();

		if (user != null)
			users.push(user);
	} while (user != null);

	return users;
}

function listGames(channel) {
	channel.send("A list of games is not yet available.");
}

function startGame(game, call) {
	call.message.channel.send("Games can not yet be started.");
}

module.exports = {
	id: "game",
	aliases: ["games", "play"],
	description: "Starts a game.",
	load: () => {},
	execute: (call) => {
		var name = call.params.readParameter();
		var found = false;

		if (name != null) {
			var game = modules.get(name.toLowerCase()) || modules.find((module) => module.aliases != null && module.aliases.indexOf(name) > -1);

			if (game != null) {
				var users = collectUsers(call.params);
				found = true;

				if (!game.autostart) {
					startGame(game, call);
				} else {
					call.message.channel.send(`The game ${name} can not be started manually.`);
				}
			}
		}
		if (!found)
			listGames(call.message.channel);
	}
};
