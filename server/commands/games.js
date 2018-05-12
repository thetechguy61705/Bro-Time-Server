const Discord = require("discord.js");
var fs = require("fs");
var util = require("util");
var { Collection, RichEmbed, ReactionCollector } = require("discord.js");
var { GameAccess } = require("./../../data/server");
var modules = new Collection();
var sessions = [];

const DEFAULTS = [
	{key: "autoStart", value: false},
	{key: "minPlayers", value: 0},
	{key: "maxPlayers", value: Infinity},
	{key: "allowLateJoin", value: true},
	{key: "requiresInvite", value: false},
	{key: "inviteTime", value: 180000},
	// 3 minutes
	{key: "timeout", value: 180000},
	{key: "updateInterval", value: 0},
	{key: "multithreaded", value: false}
];
const INVITE = `%s

React to this message to join.`;
// times per second
const MAX_UPDATE_CYCLES = 60;

fs.readdirSync(__dirname + "/../games").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match != null) {
		new Promise((resolve, reject) => {
			try {
				var game = require("../games/" + match[1]);
				DEFAULTS.forEach((entry) => {
					if (typeof game[entry.key] !== typeof entry.value)
						game[entry.key] = entry.value;
				});
				resolve(game);
			} catch (exc) {
				reject(exc);
			}
		}).then(module => {
			modules.set(module.id, module);
		}, exc => {
			console.warn(`Unable to load game module ${match}:`);
			console.warn(exc.stack);
		});
	}
});

function listGames(message) {
	var gameList = modules.keyArray();
	if (message == null) return gameList;
	var gameEmbed = new Discord.RichEmbed()
		.setTitle("Available Games")
		.setDescription("`" + gameList.join("`\n`") + "`")
		.setFooter(`Ran by ${message.author.username} (${message.author.id})`, message.author.dsiplayAvatarURL)
		.setColor(0x00AE86);
	if (gameEmbed.description !== "``") {
		return message.channel.send({ embed: gameEmbed });
	} else {
		return message.reply("Currently there are no games to view.");
	}
}

// users, call
function dispatchInvites(game, call, players, allowLateJoin) {
	// Send an invite message to the same channel.
	// Tell users to react to join.
	// Resolve once minPlayers is met.
	// Stop collecting players if allowLateJoin is false.
	var embed = new RichEmbed()
		.setDescription(util.format(INVITE, game.shortDescription || game.longDescription || game.id))
		.addField("Minimum Players", game.minPlayers, true)
		.addField("Maximum Players", game.maxPlayers, true)
		.setTitle(`Invite to ${game.id}`)
		.setColor(0x00AE86);
	var message = await call.message.channel.send(embed);
	var collector = new ReactionCollector(message, () => true, {time: game.inviteTime});
	return new Promise((resolve, reject) => {
		collector.on("collect", (reaction) => {
			if (!players.some((user) => reaction.users.has(user.id))) {
				players.set(user.id, user);
				if (players.size == game.minPlayers) {
					if (!game.allowLateJoin)
						collector.stop("ready");
					resolve();
				}
			}
		});
		collector.on("end", () => {
			reject();
		});
	});
}

function endGame() {

}

function startGame(game, games, call) {
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
		players: new Collection()
	};
	endGameInstance = endGame.bind(session);
	session.endGame = endGameInstance;
	if (game.requiresInvite) {
		let inviting = dispatchInvites(game, call, session.players, game.minPlayers, game.maxPlayers, game.allowLateJoin);
		inviting.then((accepted) => session.players = accepted);
		loading.push(inviting);
	}

	Promise.all(loading).then(() => {
		console.log("game loaded.");

		if (call.updateInterval > 0)
			session.updateTimer = call.client.setInterval(1/Math.min(game.updateInterval, MAX_UPDATE_CYCLES)*1000, game.update);
		session.endTimer = call.client.setTimeout(session.timeout, endGameInstance);

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
				found = true;

				if (!game.autostart) {
					startGame(game, this, call);
				} else {
					call.message.channel.send(`The game ${name} can not be started manually.`);
				}
			}
		}
		if (!found)
			listGames(call.message);
	}
};
