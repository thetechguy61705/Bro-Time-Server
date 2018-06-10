var responses = require("app/greetingResponses");
var util = require("util");

var OPTIONS = "img";
var RESPONSE = "%s <@%s>!";
var MAX_LENGTH = 100;

module.exports = {
	exec: function(message, client) {
		if (message.isMentioned(client.user)) {
			var greeting = this.getGreeting(message, client);

			if (greeting != null)
				message.channel.send(util.format(RESPONSE, greeting, message.author.id));
		}
	},

	getGreeting: function(message, client) {
		var content = message.content;
		var matches;
		var greeting;
		for (var pattern in responses) {
			if (responses.hasOwnProperty(pattern)) {
				matches = new RegExp(pattern, OPTIONS).exec(content);
				if (matches != null) {
					if (!client.locked) {
						greeting = responses[pattern](matches).substring(0, MAX_LENGTH);
					} else {
						client.lockedChannels.push(message.channel.id);
						message.channel.send("The client is currently in lockdown and inaccessible by any user.").catch(() => {});
					}
					break;
				}
			}
		}
		return greeting;
	}
};
