var errorHandler = require("app/errorHandler");
var config = require("../../config");
var { Collection } = require("discord.js");
var fs = require("fs");
var sources = [];
var tokens = new Collection();
var vote = require("app/vote");

// A map from source to token.
const TOKENS_MAPPING = {
	youtube: "GOOGLE"
};
const VOTE_TIMEOUT = 60000;
const VOTE_REQUIRED = 0.30;
const MUSIC_CHANNELS = ["music", "songs"];

class Queue extends Array {
	constructor(music, guild) {
		super();
		this.music = music;
		music.players.set(guild.id, this);
	}

	play(stream, call) {
		if (this.length === 0)
			this.begin(stream, call);
		this.push(stream);
	}

	stop() {
		this.length = 0;
		if (this.dispatcher != null)
			this.dispatcher.end("Finished playing.");
	}

	skip() {
		if (this.dispatcher != null)
			this.dispatcher.end("Skipping song.");
	}

	pause() {
		if (this.dispatcher != null)
			this.diaptcher.pause();
	}

	resume() {
		if (this.dispatcher != null)
			this.dispatcher.resume();
	}

	begin(stream, call) {
		if (this.connection != null) {
			this.dispatcher = this.connection.playStream(stream);
			errorHandler(this.dispatcher);
			this.dispatcher.on("end", () => {
				this.shift();
				if (this.length > 0) {
					this.begin(this[0], call);
				} else {
					this.music.players.delete(this.connection.channel.guild.id);
					this.connection.channel.leave();
					call.message.channel.send("Stopped playing music.");
				}
			});
			call.message.channel.send(`Now playing ${stream.title} by ${stream.author}!`);
		} else if (call.message.member.voiceChannel != null && Music.isMusicChannel(call.message.member.voiceChannel)) {
			call.message.member.voiceChannel.join().then((connection) => {
				this.connection = connection;
				this.begin(stream, call);
			}, (exc) => {
				call.message.channel.send(exc.message);
				console.warn(exc.stack);
			});
		} else {
			call.message.channel.send("The member is not in a voice channel.");
		}
	}
}

class Music {
	static isDJ(member) {
		const premiumRoles = ["330919872630358026", "402175094312665098", "436013049808420866", "436013613568884736", "DJ"];
		return ((member.roles.some((role) => premiumRoles.includes(role.name) || premiumRoles.includes(role.id)))
			|| (member.voiceChannel != null && member.voiceChannel.members.filter((member) => !member.user.bot).size === 1)) ? true : false;
	}

	static request(message, prompt) {
		var result;
		if (Music.isDJ(message.member)) {
			result = Promise.resolve(true);
		} else {
			var voiceChannel = message.member.voiceChannel;
			result = vote(VOTE_TIMEOUT, message.channel, Math.floor(voiceChannel.members.size*VOTE_REQUIRED),
				(user) => { return voiceChannel.members.has(user.id); },
				null, prompt, message.user);
		}
		return result;
	}

	static isMusicChannel(channel) {
		var name = channel.name.toLowerCase();
		return MUSIC_CHANNELS.some((keyword) => { return name.startsWith(keyword) || name.endsWith(keyword); });
	}

	static async getTicket(client, channel, query) {
		// requestInput
		var ticket;
		for (var source of sources) {
			ticket = await source.getTicket(query, tokens.get(source.id));
			if (ticket != null) {
				Object.defineProperty(ticket, "load", {
					value: source.load.bind(source, ticket)
				});
				break;
			}
		}
		if (ticket == null) {
			console.log("search required...");
			ticket = null;
			// gather searches.
			// sort by weight.
			// take top results.
			// Request input (until the user provides a valid index).
			// Return getTicket with the new query.
			/* var searches = [];
			for (var source of sources) {
				source.search(query, tokens.get(source.id));
			} */
		} else if (!Music.isAcceptable(ticket, source, false, channel)) {
			ticket = null;
		}
		return ticket;
	}

	static isAcceptable(ticket, source, matureAllowed, channel) {
		var playable = source.getPlayable(ticket);
		if (playable == "mature" && !matureAllowed)
			channel.send("Mature music is not allowed here.");
		return playable === "good" ||
			(playable !== "bad" &&
			(matureAllowed || playable !== "mature") &&
			playable !== "unknown");
	}

	constructor(client) {
		this.isDJ = Music.isDJ;
		this.players = new Collection();
		this.client = client;
	}

	play(query, call) {
		var queue = this.players.has(call.message.guild.id) ?
			this.players.get(call.message.guild.id) :
			new Queue(this, call.message.guild);
		if (query != null) {
			Music.getTicket(call.message.client, call.message.channel, query, call.requestInput).then((ticket) => {
				if (ticket != null) {
					queue.play(ticket.load(), call);
				} else {
					call.message.channel.send("Can't find music for the query!");
				}
			});
		} else if (queue.paused) {
			queue.resume();
		}
	}

	stop(call) {
		if (call.client.voiceConnections.has(call.message.guild.id)) {
			Music.request(call.message, "Stop playing music?").then((accepted) => {
				if (accepted) {
					if (this.players.has(call.message.guild.id))
						this.players.get(call.message.guild.id).stop();
				}
			}, (exc) => {
				console.warn(exc.stack);
				call.message.channel.send("Unable to stop playing music (try again shortly).");
			});
		}
	}

	skip(call) {
		if (this.players.has(call.message.guild.id)) {
			Music.request(call.message, "Stop playing music?").then((accepted) => {
				if (accepted)
					this.players.get(call.message.guild.id).skip();
			}, (exc) => {
				console.warn(exc.stack);
				call.message.channel.send("Unable to skip a song (try again shortly).");
			});
		}
	}

	repeat() {
	}

	pause() {
	}
}

for (let file of fs.readdirSync(__dirname + "/../music")) {
	let match = file.match(/^(.*)\.js$/);
	if (match != null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./../music/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then((source) => {
			sources.push(source);
		}, (exc) => {
			console.warn(`Unable to load music source ${match}:`);
			console.warn(exc.stack);
		});
	}
}

module.exports = {
	id: "music",
	exec: (client) => {
		for (var [source, key] of Object.entries(TOKENS_MAPPING))
			tokens.set(source, config[key]);
		client.music = new Music();
	}
};
