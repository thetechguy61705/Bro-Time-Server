/*
Number 1 - 10 for non-premium users, 1 - 20 for premium users.
Use every 5 minutes.
*/

var premium = require("app/premium");

module.exports = {
	id: "loot",
	description: "Gives you a random amount of Bro Bits.",
	rateLimit: [],
	execute: (call) => {
		if (module.exports.rateLimit.indexOf(call.message.author.id) === -1) {
			var multiplier = (premium(call.message.member)) ? 20 : 10;
			var randomBits = Math.ceil(Math.random() * multiplier);
			call.getWallet(call.message.author.id).change(randomBits).then(() => {
				call.message.reply("You looted " + randomBits + " Bro Bits!");
				module.exports.rateLimit.push(call.message.author.id);
				call.client.setTimeout(() => {
					module.exports.rateLimit.splice(module.exports.rateLimit.indexOf(call.message.author.id), 1);
					if (call.message.content.toLowerCase().endsWith("true" || " t")) {
						call.message.author.send("You can loot Bro Bits again!");
					}
				}, 300000);
			}).catch(() => {
				call.safeSend("Failed to give you Bro Bits.");
			});
		} else call.safeSend("You must wait 5 minutes from the last time you used the command.");
	}
};
