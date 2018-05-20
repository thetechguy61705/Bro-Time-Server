var { Collection } = require("discord.js");
var tokens = new Collection();
var isDJ = require("app/dj");
var vote = require("app/vote");

// A map from source to token.
const TOKENS_MAPPING = {
	youtube: "google"
};
const VOTE_TIMEOUT = 60000;
const VOTE_REQUIRED = 0.30;
const MUSIC_CHANNELS = ["music", "songs"];

class Queue {
	static request(message, prompt) {
		var result;
		if (isDJ(message.member)) {
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

	constructor() {
		this.players = new Collection();
	}

	play(query, message, client) {
		this.reserve(message.member, client).then(() => {
			console.log("Playing:", query);
		}, () => {
			console.log("Can't play!");
		});
	}

	stop(message) {
		this.release(message.member).then(() => {
			console.log("Stopped playing.");
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

	release(member) {
		return new Promise((resolve) => {
			if (this.players.has(member.guild.id)) {
				this.players.get(member.guild.id).channel.leave();
				this.players.delete(member.guild.id);
			}
			resolve();
		});
	}

	pause() {

	}
}

module.exports = {
	exec: (client, bot) => {
		var botTokens = new Collection();
		for (var [source, key] of Object.entries(TOKENS_MAPPING)) {
			botTokens.set(source, bot[key]);
		}
		tokens.set(client.user.id, botTokens);
		client.music = new Queue();

		/* client.on("message", (message) => {
			if (message.content == "reserve") {
				client.music.reserve(message.member);
			} else if (message.content == "release") {
				client.music.release(message.member);
			}
		}); */
	}
};
