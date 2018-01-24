var util = require("util");

var GREETING = "(^%s|%s[/.!/?]*$)";
var MAX_LENGTH = 100;

function newGreeting(pattern) {
	return util.format(GREETING, pattern, pattern);
}

var RESPONSES = {};
// phrase (regular expression string): Response (string)
RESPONSES[newGreeting("hello")] = () => "Hi";
RESPONSES[newGreeting("hi")] = () => "Hello";
RESPONSES[newGreeting("hey")] = () => "Hello";
RESPONSES[newGreeting("greetings")] = () => "Hey";
RESPONSES[newGreeting("greeting")] = () => "Hey";
RESPONSES[newGreeting("ahoy")] = () => "Greetings";
RESPONSES[newGreeting("hai")] = () => "Oh hi";
RESPONSES[newGreeting("su+p")] = matches => "Y" + "o".repeat(Math.min(matches[0].length, MAX_LENGTH) - 2);
RESPONSES[newGreeting("yo")] = matches => "S" + "u".repeat(Math.min(matches[0].length, MAX_LENGTH) - 1) + "p";
RESPONSES[newGreeting("e+y+")] = matches => matches[0];
RESPONSES[newGreeting("a+y+")] = matches => matches[0];
RESPONSES[newGreeting("howdy")] = () => "howdy";
RESPONSES[newGreeting("was+up")] = matches => "Wa" + "s".repeat(Math.min(matches[0].length, MAX_LENGTH) - 3) + "up";
RESPONSES[newGreeting("waz+up")] = matches => "Wa" + "z".repeat(Math.min(matches[0].length, MAX_LENGTH) - 3) + "up";
RESPONSES[newGreeting("salutation")] = () => "greeting";
RESPONSES[newGreeting("salutations")] = () => "greetings";

module.exports = RESPONSES;
