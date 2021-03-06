var util = require("util");

var GREETING = "(^%s|%s[/.!/?]*$)";
var MAX_LENGTH = 100;

function newGreeting(pattern) {
	return util.format(GREETING, pattern, pattern);
}

// phrase (regular expression string): Response (string)
module.exports[newGreeting("hello")] = () => "Hi";
module.exports[newGreeting("hi|hey")] = () => "Hello";
module.exports[newGreeting("greetings?")] = () => "Hey";
module.exports[newGreeting("ahoy")] = () => "Greetings";
module.exports[newGreeting("hai")] = () => "Oh hi";
module.exports[newGreeting("su+p")] = (matches) => "Y" + "o".repeat(Math.min(matches[0].length, MAX_LENGTH) - 2);
module.exports[newGreeting("yo")] = (matches) => "S" + "u".repeat(Math.min(matches[0].length, MAX_LENGTH) - 1) + "p";
module.exports[newGreeting("e+y+")] = (matches) => matches[0];
module.exports[newGreeting("a+y+")] = (matches) => matches[0];
module.exports[newGreeting("howdy|" +
	"hola|" +
	"bonjour")] = (matches) => matches[0].charAt(0).toUpperCase() + matches[0].substring(1, matches[0].length);
module.exports[newGreeting("how('?s|( is it)) it going?'?\\?*?")] = () => "Great";
module.exports[newGreeting("was+up")] = (matches) => "Wa" + "s".repeat(Math.min(matches[0].length, MAX_LENGTH) - 3) + "up";
module.exports[newGreeting("waz+up")] = (matches) => "Wa" + "z".repeat(Math.min(matches[0].length, MAX_LENGTH) - 3) + "up";
module.exports[newGreeting("salutations?")] = (matches) => "greeting" + (matches[0].endsWith("s") ? "s" : "");
