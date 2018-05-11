const Discord = require("discord.js");
var fs = require("fs");
var { Collection } = require("discord.js");
var { GameAccess } = require("./../../data/server");
var modules = new Collection();
var sessions = [];

// 10 minutes
const TIMEOUT = 600000;
// times per second
const MAX_UPDATE_CYCLES = 60;

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

function listGames(message) {
	fs.readdirSync(__dirname + "/../games", (err, files) => {
		var gameFiles = files.filter(file => file.split(".").pop() === "js").map(file => file.slice(0, -3));
		if (message === null) return gameFiles;
		var gameEmbed = new Discord.RichEmbed()
			.setTitle("Available Games")
			.setDescription("`" + gameFiles.join("`\n`") + "`")
			.setFooter(`Ran by ${message.author.username} (${message.author.id})`, message.author.dsiplayAvatarURL);
		if (gameEmbed.description !== "``") message.channel.send({ embed: gameEmbed }).catch(function() {});
		else message.reply("Currently there are no games to view.").catch(function() {});
	});
}

// users, call
function dispatchInvites() {

}

function endGame() {

}

function startGame(game, inviting, games, call) {
	var loading, session, endGameInstance;

	loading = [new Promise((resolve, reject) => {
		try {
			console.log("loading game...");
			resolve(new GameAccess(game, games).load());
		} catch(exc) {
			reject(exc);
		}
	})];

	session = {
		players: null
	};
	endGameInstance = endGame.bind(session);
	session.endGame = endGameInstance;
	if (game.requiresInvite) {
		let inviting = dispatchInvites(inviting, call);
		inviting.then((accepted) => session.players = accepted);
		loading.push(inviting);
	}

	Promise.all(loading).then(() => {
		console.log("game loaded.");

		if (call.updateInterval > 0)
			session.updateTimer = call.client.setInterval(1/Math.min(game.updateInterval, MAX_UPDATE_CYCLES)*1000, game.update);
		session.endTimer = call.client.setTimeout(TIMEOUT, endGameInstance);

		console.log("timers set");

		game.start(session);

		console.log("game started");

		sessions.push(session);

		console.log("session stored");
	});
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
					startGame(game, users, this, call);
				} else {
					call.message.channel.send(`The game ${name} can not be started manually.`);
				}
			}
		}
		if (!found)
			listGames(call.message);
	}
};
