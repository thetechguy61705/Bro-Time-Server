var discord = require("discord.js");
var util = require("util");

// phrase (lower cased): Response (capitalized)
var RESPONSES = {
	hello: "Hi",
	hi: "Hello",
	hey: "Hello",
	greetings: "Hey",
	greeting: "Hey",
	ahoy: "Greetings",
	hai: "Oh hi"
};
var FORMAT = "%s <@%s>!";

function getGreeting(message) {
	var content = message.content.toLowerCase();
	for (var phrase in RESPONSES) {
		if (!RESPONSES.hasOwnProperty(phrase))
			continue;
		
		if (content.startsWith(phrase))
			return RESPONSES[phrase];
	}
	return null;
}

module.exports = function(message, client) {
	if (message.isMentioned(client.user)) {
		var response = getGreeting(message);
		
		if (response !== null)
			message.channel.send(util.format(FORMAT, response, message.author.id));
	}
};
