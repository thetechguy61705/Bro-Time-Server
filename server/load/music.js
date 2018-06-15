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

class Queue {
	static isDj(member) {
		const premiumRoles = ["330919872630358026", "402175094312665098", "436013049808420866", "436013613568884736", "DJ"];
		return ((member.roles.some((role) => premiumRoles.includes(role.name) || premiumRoles.includes(role.id)))
			|| (member.voiceChannel != null && member.voiceChannel.members.filter((member) => !member.user.bot).size === 1)) ? true : false;
	}

	static request(message, prompt) {
		var result;
		if (Queue.isDJ(message.member)) {
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
		var ticket;
		for (var source of sources) {
			ticket = await source.getTicket(query, tokens.get(source.id));
			if (ticket != null)
				break;
		}
		if (ticket == null) {
			console.log("search required...");
			/* var searches = [];
			for (var source of sources) {
				source.search(query, tokens.get(source.id));
			} */
		} else if (!Queue.isAcceptable(ticket, source, false, channel)) {
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
		this.isDj = Queue.isDj;
		this.players = new Collection();
		this.client = client;
	}

	play(query, message) {
		this.reserve(message.member).then(() => {
			Queue.getTicket(message.client, message.channel, query).then((ticket) => {
				if (ticket != null) {
					console.log("Playing:", ticket.video_url);
				} else {
					console.log("Can't find ticket.");
				}
			});
		}, () => {
			console.log("Can't play!");
		});
	}

	stop(message) {
		Queue.request(message, "Stop playing music?").then((accepted) => {
			this.release(message.member.guild).then(() => {
				if (accepted)
					message.channel.send("Stopped playing music.");
			});
		}, (exc) => {
			console.warn(exc.stack);
			message.channel.send("Unable to stop playing music (try again shortly).");
		});
	}

	skip() {

	}

	repeat() {

	}

	reserve(member) {
		return new Promise((resolve, reject) => {
			if (!this.players.has(member.guild.id)) {
				if (member.voiceChannel != null && Queue.isMusicChannel(member.voiceChannel)) {
					member.voiceChannel.join().then((connection) => {
						this.players.set(member.voiceChannel.guild.id, connection);
						resolve(true);
					}).catch(reject);
				} else {
					reject(new Error("The member is not in a voice channel."));
				}
			} else {
				resolve(true);
			}
		});
	}

	release(guild) {
		return new Promise((resolve) => {
			if (this.players.has(guild.id)) {
				this.players.get(guild.id).channel.leave();
				this.players.delete(guild.id);
			}
			resolve();
		});
	}

	pause() {

	}
}

for (let file of fs.readdirSync(__dirname + "/../music")) {
	var match = file.match(/^(.*)\.js$/);
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
		client.music = new Queue();

		/* client.on("message", (message) => {
			if (message.content.startsWith("play")) {
				client.music.play(message.content.substring(5), message);
			} else if (message.content.startsWith("stop")) {
				client.music.stop(message);
			}
		}); */
	}
};
