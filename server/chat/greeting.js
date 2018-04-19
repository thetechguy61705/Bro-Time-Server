var responses = require("app/greetingResponses");
var util = require("util");

var OPTIONS = "img";
var RESPONSE = "%s <@%s>!";
var MAX_LENGTH = 100;

module.exports = {
	exec: function(message, client) {
		if (message.isMentioned(client.user)) {
			var greeting = this.getGreeting(message);

			if (greeting != null)
				message.channel.send(util.format(RESPONSE, greeting, message.author.id));
		}
	},

	getGreeting: function(message) {
		var content = message.content;
		var matches;
		var greeting;
		for (var pattern in responses) {
			if (responses.hasOwnProperty(pattern)) {
				matches = new RegExp(pattern, OPTIONS).exec(content);
				if (matches != null) {
					greeting = responses[pattern](matches).substring(0, MAX_LENGTH);
					break;
				}
			}
		}
		return greeting;
	}
};
