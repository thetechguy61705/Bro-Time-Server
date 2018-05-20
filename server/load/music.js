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

	play(query, message, client) {
		this.reserve(message.user, client);

		console.log("queueing:", query);
	}

	stop() {
		this.release();

		console.log("stopping");
	}

	skip() {

	}

	repeat() {

	}

	reserve(user, client) {
		// If the user is in a music channel, join it, and create a voice connection
		console.log(user, client);
	}

	release () {
		// If a voice connection is active, Disconnect the voice connection, and leave the voice channel.
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
