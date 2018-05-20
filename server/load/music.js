var tokens = {};

// A map from source to token.
const TOKENS_MAPPING = {
	youtube: "google"
};

class Queue {

}

module.exports = {
	exec: (client, bot) => {
		var botTokens = new Map();
		for (var [source, key] of Object.entries(TOKENS_MAPPING)) {
			botTokens.set(source, bot[key]);
		};
		tokens[client.token] = botTokens;
		client.music = new Queue();
	}
};
