const Discord = require("discord.js");
var fs = require("fs");
var util = require("util");
var { Collection, RichEmbed, ReactionCollector, Message } = require("discord.js");
var { GameAccess } = require("./../../data/server");
var modules = new Collection();
var sessions = [];
var noPing = [];
var games;

const DEFAULTS = [
	{ key: "autoStart", value: false },
	{ key: "minPlayers", value: 0 },
	{ key: "maxPlayers", value: Infinity },
	{ key: "allowLateJoin", value: true },
	{ key: "requiresInvite", value: false },
	{ key: "inviteTime", value: 180000 },
	{ key: "timeout", value: 180000 },
	{ key: "updateInterval", value: 0 },
	{ key: "multithreaded", value: false }
];
const INVITE = `%s

React with the <:pixeldolphin:404768960014450689> emoji to join the game.`;
// times per second
const MAX_UPDATE_CYCLES = 60;

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

function invite(game, channel, players, host) {
	var messageContent;
	const inviteEmbed = new RichEmbed()
		.setDescription(util.format(INVITE, game.shortDescription || game.longDescription || game.id))
		.addField("Minimum Players", game.minPlayers, true)
		.addField("Maximum Players", game.maxPlayers, true)
		.setTitle(`Invite to ${game.id}`)
		.setColor(0x00AE86);
	if (channel.guild.roles.find("name", "Bro Time Games")) {
		var allowedToPing = channel.guild.roles.find("name", "Bro Time Games").members.filter((m) => m.user.presence.status === "online").array().map((m) => m.id);
		var hostIndex = allowedToPing.indexOf(host.id);
		if (hostIndex > -1) allowedToPing.splice(hostIndex, 1);
		hostIndex = noPing.indexOf(host.id);
		if (hostIndex > -1) noPing.splice(hostIndex, 1);
		if (noPing.length > 0) allowedToPing = allowedToPing.filter((m) => !noPing.includes(m));
		if (allowedToPing.length > 0) {
			allowedToPing = allowedToPing.slice(0, 3);
			allowedToPing.forEach((noping) => {
				noPing.push(noping);
			});
			messageContent = `Pinging online members in Bro Time Games role: ${allowedToPing.map((m) => m.toString()).join(", ")}`;
		} else {
			messageContent = "Nobody to ping!";
		}
	}
	return new Promise((resolve, reject) => {
		channel.send(messageContent, { embed: inviteEmbed }).then((message) => {
			message.react("404768960014450689").then(() => {
				var collector = new ReactionCollector(message, (reaction, user) =>
					reaction.emoji.id === "404768960014450689" &&
					user.id !== message.author.id &&
					user.id !== host.id, {
					time: game.inviteTime
				});
				collector.on("collect", (reaction) => {
					if (!players.keyArray().includes(reaction.users.last().id)) {
						var user = reaction.users.last();
						hostIndex = noPing.indexOf(user.id);
						if (hostIndex > -1) noPing.splice(hostIndex, 1);
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
			}).catch(() => { });
		}).catch(() => { });
	});
}

function startGame(game, context) {
	var loading, session;

	loading = [new Promise((resolve, reject) => {
		try {
			resolve(new GameAccess(game, context.games).load());
		} catch (exc) {
			reject(exc);
		}
	})];

	session = {
		game: game,
		ended: false,
		context: context,
		players: new Collection(),
		endGame: () => {
			if (!session.ended) {
				clearTimeout(session.endTimer);
				clearInterval(session.updateTimer);
				session.ended = true;
				session.game.end(session);
			}
		}
	};
	if (context.message != null)
		session.host = context.message.author;
	if (game.requiresInvite)
		loading.push(invite(game, context.channel, session.players, session.host));

	Promise.all(loading).then(() => {
		if (game.updateInterval > 0)
			session.updateTimer = context.client.setInterval(1 / Math.min(game.updateInterval, MAX_UPDATE_CYCLES) * 1000, game.update);
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

fs.readdirSync(__dirname + "/../games").forEach((file) => {
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
		}).then((module) => {
			modules.set(module.id, module);
		}, (exc) => {
			console.warn(`Unable to load game module ${match}:`);
			console.warn(exc.stack);
		});
	}
});

module.exports = {
	Input: Input,
	loaded: modules,

	id: "game",
	aliases: ["games", "play"],
	description: "Starts a game.",
	paramsHelp: "[game]",
	execute: (call) => {
		var name = call.params.readParameter();
		var found = false;
		if (games != null)
			games = this;

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
