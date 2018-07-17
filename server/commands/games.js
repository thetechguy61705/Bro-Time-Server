const { Collection, RichEmbed, ReactionCollector, Message } = require("discord.js");
const uuid = require("uuid/v1");
const fs = require("fs");
const util = require("util");

var { Wallet } = require("@utility/wallet.ts");
var modules = new Collection();
var sessions = [];
var noPing = [];
var games;

function getWallet(userId = null) {
	return new WalletAccess(userId);
}

const DEFAULTS = [
	{ key: "autoStart", value: false },
	{ key: "minPlayers", value: 0 },
	{ key: "maxPlayers", value: Infinity },
	{ key: "allowLateJoin", value: true },
	{ key: "requiresInvite", value: false },
	{ key: "inviteTime", value: 180000 },
	{ key: "timeout", value: 180000 },
	{ key: "updateInterval", value: 0 },
	{ key: "multithreaded", value: false },
	{ key: "betting", value: false }
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
	var gameEmbed = new RichEmbed()
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
		.setDescription(util.format(INVITE, game.shortDescription || game.longDescription || game.id, (game.bet > 0) ? "\n**THIS GAME HAS A BET ON IT.**" : ""))
		.addField("Minimum Players", game.minPlayers, true)
		.addField("Maximum Players", game.maxPlayers, true)
		.setTitle(`Invite to ${game.id}`)
		.setDefaultFooter(host)
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
			for (var noping of allowedToPing) noPing.push(noping);
			messageContent = `Pinging online members in Bro Time Games role: ${allowedToPing.map((m) => `<@${m}>`).join(", ")}`;
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
				var poorUsers = [];
				collector.on("collect", async (reaction) => {
					var user = reaction.users.last();
					if (!players.has(user.id)) {
						var userBalance = (channel.client.user.id === "393532251398209536") ? await getWallet(user.id).getTotal() : Infinity;
						if (userBalance >= (game.bet || 0)) {
							hostIndex = noPing.indexOf(user.id);
							if (hostIndex > -1) noPing.splice(hostIndex, 1);
							players.set(user.id, user);
							if (players.size >= game.maxPlayers - 1) {
								collector.stop("ready");
								resolve();
							} else if (players.size === game.minPlayers - 1) {
								if (!game.allowLateJoin)
									collector.stop("ready");
								resolve();
							}
						} else {
							if (!poorUsers.includes(user.id)) {
								channel.send("You do not have enough money to enter this game.", { reply: user });
								poorUsers.push(user.id);
							}
						}
					}
				});
				collector.on("end", (_, reason) => {
					if (reason === "time" && players.size >= (game.minPlayers - 1) && players.size <= (game.maxPlayers - 1)) {
						resolve();
					} else if (reason !== "ready") {
						reject();
					}
				});
			});
		});
	});
}

function startGame(game, context, solo) {
	var loading, session;

	loading = [new Promise((resolve, reject) => {
		try {
			resolve(game.load());
		} catch (exc) {
			reject(exc);
		}
	})];

	session = {
		id: uuid(),
		game: game,
		ended: false,
		context: context,
		players: new Collection(),
		getWallet: getWallet,
		endGame: () => {
			if (!session.ended) {
				sessions.splice(sessions.indexOf(sessions.find((s) => s.id === session.id)), 1);
				clearTimeout(session.endTimer);
				clearInterval(session.updateTimer);
				session.ended = true;
				if (session.tooPoor) session.context.channel.send("This game was cancelled because a user playing it became too poor to meet the bet required on this gmae.");
				session.game.end(session);
				if (session.game.betting && session.winner != null && session.game.bet > 0 && session.players.size > 1) {
					for (let player of session.players.keyArray())
						if (player != session.winner.id)
							getWallet(player).transfer(session.game.bet, (session.winner.id != session.context.client.user.id) ? session.winner.id : null);
				}
			}
		}
	};
	if (context.message != null)
		session.host = context.message.author;
	if (game.requiresInvite && !solo)
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

for (let file of fs.readdirSync(__dirname + "/../games")) {
	var match = file.match(/^(.*)\.js$/);
	if (match != null) {
		new Promise((resolve, reject) => {
			try {
				var game = require("@server/games/" + match[1]);
				for (var entry of DEFAULTS) {
					if (typeof game[entry.key] !== typeof entry.value)
						game[entry.key] = entry.value;
				}
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
}

module.exports = {
	Input: Input,
	loaded: modules,

	id: "game",
	aliases: ["games"],
	description: "Starts a game.",
	paramsHelp: "[game] [amount to bet]",
	access: "Server",
	botRequires: ["ADD_REACTIONS"],
	botRequiresMessage: "To create a game invitation method. Some games also require MANAGE_MESSAGES for removing reactions although it is not required.",
	execute: async (call) => {
		var name = call.params.readParam();
		var bet = (call.client.user.id === "393532251398209536") ? (call.params.readNumber(false, false) || 0) : 0;
		if (bet < 0) bet = 0;
		var found = false;
		if (games != null)
			games = this;

		if (name != null) {
			var game = modules.get(name.toLowerCase()) || modules.find((module) => module.aliases != null && module.aliases.indexOf(name) > -1);
			if (game != null) {
				found = true;
				if (game.betting) game.bet = bet;
				var solo = bet === 0 && call.params.readParam() === "-solo" && game.minPlayers === 1;
				var userBalance = (call.client.user.id === "393532251398209536") ? await getWallet(call.message.author.id).getTotal() : Infinity;

				if (userBalance >= bet) {
					if (!game.autostart) {
						startGame(game, new Context(call.client, call.message), solo);
					} else {
						call.message.channel.send(`The game ${name} can not be started manually.`);
					}
				} else call.safeSend("You do not have enough money to make this bet.");
			}
		}
		if (!found)
			listGames(call.message);
	},
	dispatchInput: (input) => {
		for (let session of sessions) {
			if ((input.channel == null || input.channel == session.context.channel) &&
				(!session.game.requiresInvite || session.host.id === input.user.id || session.players.has(input.user.id))) {
				if (session.game.input(input, session))
					session.restartEndTimer();
			}
		}
	},
	dispatchBalances: (userId, newBalance) => {
		for (let session of sessions) {
			if (session.game.betting && session.game.bet > 0 && session.players.has(userId || require("@server/server").client.user.id) && session.game.bet > newBalance) {
				session.tooPoor = true;
				session.endGame();
			}
		}
	}
};
