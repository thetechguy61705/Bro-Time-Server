var responses = require("./utility/greetingResponses");
var util = require("util");

var OPTIONS = "img";
var RESPONSE = "%s <@%s>!";
var MAX_LENGTH = 100;

module.exports = {
	exec: function(message, client) {
		if (message.isMentioned(client.user)) {
			var response = this.getGreeting(message);

			if (response !== null)
				message.channel.send(util.format(RESPONSE, response, message.author.id));
		}
	},

	getGreeting: function(message) {
		var content = message.content;
		var matches;
		for (var pattern in responses) {
			if (!responses.hasOwnProperty(pattern))
				continue;

			matches = new RegExp(pattern, OPTIONS).exec(content);
			if (matches !== null)
				return responses[pattern](matches).substring(0, MAX_LENGTH);
		}
		return null;
	}
};
