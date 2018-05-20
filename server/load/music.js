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

	play(query, message, client) {
		this.reserve(message.member, client).then(() => {
			console.log("Playing:", query);
		}, () => {
			console.log("Can't play!");
		});
	}

	stop() {
		this.release().then(() => {
			console.log("Stopped playing.");
		});
	}

	skip() {

	}

	repeat() {

	}

	reserve(member) {
		return new Promise((resolve, reject) => {
			if (this.connection == null && member.voiceChannel != null && Queue.isMusicChannel(member.voiceChannel)) {
				member.voiceChannel.join().then((connection) => {
					this.connection = connection;
					resolve();
				}).catch(reject);
			} else {
				resolve();
			}
		});
	}

	release () {
		return new Promise((resolve) => {
			if (this.connection != null)
				this.connection.channel.leave();
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
	}
};
