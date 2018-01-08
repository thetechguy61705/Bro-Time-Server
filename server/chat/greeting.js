var util = require("util");

var GREETING = "(^%s|%s[/.!/?]*$)";
var OPTIONS = "img";
var RESPONSE = "%s <@%s>!";

function newGreeting(pattern) {
	return util.format(GREETING, pattern, pattern);
}

// phrase (regular expression string): Response (string)
var RESPONSES = {};
RESPONSES[newGreeting("hello")] = () => "Hi";
RESPONSES[newGreeting("hi")] = () => "Hello";
RESPONSES[newGreeting("hey")] = () => "Hello";
RESPONSES[newGreeting("greetings")] = () => "Hey";
RESPONSES[newGreeting("greeting")] = () => "Hey";
RESPONSES[newGreeting("ahoy")] = () => "Greetings";
RESPONSES[newGreeting("hai")] = () => "Oh hi";
RESPONSES[newGreeting("su+p")] = matches => "Y" + "o".repeat(matches[0].length - 2);
RESPONSES[newGreeting("yo")] = matches => "S" + "u".repeat(matches[0].length - 1) + "p";
RESPONSES[newGreeting("e+y+")] = matches => matches[0];
RESPONSES[newGreeting("a+y+")] = matches => matches[0];
RESPONSES[newGreeting("howdy")] = () => "howdy";
RESPONSES[newGreeting("was+up")] = matches => "Wa" + "s".repeat(matches[0].length - 3) + "up";
RESPONSES[newGreeting("waz+up")] = matches => "Wa" + "z".repeat(matches[0].length - 3) + "up";
RESPONSES[newGreeting("salutation")] = () => "greeting";
RESPONSES[newGreeting("salutations")] = () => "greetings";

function getGreeting(message) {
	var content = message.content;
	var matches;
	for (var pattern in RESPONSES) {
		if (!RESPONSES.hasOwnProperty(pattern))
			continue;

		matches = new RegExp(pattern, OPTIONS).exec(content);
		if (matches !== null)
			return RESPONSES[pattern](matches);
	}
	return null;
}

module.exports = function(message, client) {
	if (message.isMentioned(client.user)) {
		var response = getGreeting(message);

		if (response !== null)
			message.channel.send(util.format(RESPONSE, response, message.author.id));
	}
};
