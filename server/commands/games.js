const Discord = require("discord.js");
var fs = require("fs");
var util = require("util");
var { Collection, RichEmbed, ReactionCollector, Message } = require("discord.js");
var { GameAccess } = require("./../../data/server");
var modules = new Collection();
var sessions = [];
var games;

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

class Context {
	constructor(client, scope) {
		this.client = client;
		this.games = games;
		if (scope instanceof Message) {
			this.message = scope;
			this.channel = scope.channel;
		} else {
			this.channel = scope;
		}
	}
}

class Input() {
	
}

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

function invite(game, channel, players) {
	var embed = new RichEmbed()
		.setDescription(util.format(INVITE, game.shortDescription || game.longDescription || game.id))
		.addField("Minimum Players", game.minPlayers, true)
		.addField("Maximum Players", game.maxPlayers, true)
		.setTitle(`Invite to ${game.id}`)
		.setColor(0x00AE86);
	return new Promise((resolve, reject) => {
		channel.send(embed).then((message) => {
			var collector = new ReactionCollector(message, () => true, {time: game.inviteTime});
			collector.on("collect", (reaction) => {
				if (!players.some((user) => reaction.users.has(user.id))) {
					var user = reaction.users.first();
					players.set(user.id, user);
					if (players.size >= game.maxPlayers) {
						collector.stop("ready");
						resolve();
					} else if (players.size == game.minPlayers) {
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
	});
}

function endGame() {
	clearTimeout(this.endTimer);
	clearInterval(this.updateTimer);
	this.game.end(this);
}

function startGame(game, context) {
	var loading, session;

	loading = [new Promise((resolve, reject) => {
		try {
			resolve(new GameAccess(game, context.games).load());
		} catch(exc) {
			reject(exc);
		}
	})];

	session = {
		game: game,
		context: context,
		players: new Collection(),
		endGame: endGame.bind(session)
	};
	if (game.requiresInvite)
		loading.push(invite(game, context.channel, session.players));

	Promise.all(loading).then(() => {
		console.log("game loaded.");

		if (game.updateInterval > 0)
			session.updateTimer = context.client.setInterval(1/Math.min(game.updateInterval, MAX_UPDATE_CYCLES)*1000, game.update);
		session.endTimer = context.client.setTimeout(game.timeout, session.endGame);

		console.log("timers set");

		game.start(session);

		console.log("game started");

		sessions.push(session);

		console.log("session stored");
	}, () => {
		if (context.message == null) {
			context.channel.send(`Failed to load ${game.id}.`);
		} else {
			context.channel.send(`${context.message.author.username}'s invite to play ${game.id} has expired.`);
		}
	});
}

module.exports = {
	Input: Input,

	id: "game",
	aliases: ["games", "play"],
	description: "Starts a game.",
	load: () => {
		games = this;
	},
	execute: (call, client) => {
		var name = call.params.readParameter();
		var found = false;

		if (name != null) {
			var game = modules.get(name.toLowerCase()) || modules.find((module) => module.aliases != null && module.aliases.indexOf(name) > -1);

			if (game != null) {
				found = true;

				if (!game.autostart) {
					startGame(game, new Context(client, call.message));
				} else {
					call.message.channel.send(`The game ${name} can not be started manually.`);
				}
			}
		}
		if (!found)
			listGames(call.message);
	},
	dispatchInput: (input) => {
		sessions.forEach((session) => {
			if (input.channel == session.context.channel &&
				(session.players.size == 0 || session.players.exists(input.user)))
					session.game.input(input);
		});
	}
};
