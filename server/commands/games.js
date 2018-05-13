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
	{key: "timeout", value: 180000},
	{key: "updateInterval", value: 0},
	{key: "multithreaded", value: false}
];
const INVITE = `%s

React with the <:pixeldolphin:404768960014450689> emoji to join the game.`;
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

class Input {
	constructor(type, value, user, channel = null) {
		this.type = type;
		this.value = value;
		this.user = user;
		this.channel = channel;
	}
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
	const inviteEmbed = new RichEmbed()
		.setDescription(util.format(INVITE, game.shortDescription || game.longDescription || game.id))
		.addField("Minimum Players", game.minPlayers, true)
		.addField("Maximum Players", game.maxPlayers, true)
		.setTitle(`Invite to ${game.id}`)
		.setColor(0x00AE86);
	return new Promise((resolve, reject) => {
		channel.send({ embed: inviteEmbed }).then((message) => {
			message.react("404768960014450689").then(() => {
				var collector = new ReactionCollector(message, (reaction, user) => reaction.emoji.id === "404768960014450689" && user.id !== channel.client.user.id, {
					time: game.inviteTime
				});
				collector.on("collect", (reaction) => {
					if (!players.keyArray().includes(reaction.users.last().id)) {
						var user = reaction.users.last();
						players.set(user.id, user);
						if (players.size >= game.maxPlayers - 1) {
							collector.stop("ready");
							resolve();
						} else if (players.size == game.minPlayers - 1) {
							if (!game.allowLateJoin)
								collector.stop("ready");
							resolve();
						}
					}
				});
				collector.on("end", (_, reason) => {
					if (reason !== "ready")
						reject();
				});
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
	if (context.message != null)
		session.host = context.message.author;
	if (game.requiresInvite)
		loading.push(invite(game, context.channel, session.players));

	Promise.all(loading).then(() => {
		if (game.updateInterval > 0)
			session.updateTimer = context.client.setInterval(1/Math.min(game.updateInterval, MAX_UPDATE_CYCLES)*1000, game.update);
		session.endTimer = context.client.setTimeout(session.endGame, game.timeout);
		session.restartEndTimer = (() => {
			clearTimeout(session.endTimer);
			session.endTimer = context.client.setTimeout(session.endGame, game.timeout);
		});

		game.start(session);
		sessions.push(session);
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
	execute: (call) => {
		var name = call.params.readParameter();
		var found = false;

		if (name != null) {
			var game = modules.get(name.toLowerCase()) || modules.find((module) => module.aliases != null && module.aliases.indexOf(name) > -1);

			if (game != null) {
				found = true;

				if (!game.autostart) {
					startGame(game, new Context(call.client, call.message));
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
			if ((input.channel == null || input.channel == session.context.channel) &&
				(!session.game.requiresInvite || session.host.id === input.user.id || session.players.has(input.user.id))) {
				if (session.game.input(input, session))
					session.restartEndTimer();
			}
		});
	}
};
