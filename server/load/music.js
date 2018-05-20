var { Collection } = require("discord.js");
var tokens = new Collection();

// A map from source to token.
const TOKENS_MAPPING = {
	youtube: "google"
};

class Queue {
	static request(user, action) {
		// if DJ, accept immidiatly.
		// else, start vote.
		console.log(user, action);
	}

	play(query, user, client) {
		this.reserve(user, client);

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
