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
				call.message.reply("You looted " + randomBits + " Bro Bits!").catch(() => {});
				module.exports.rateLimit.push(call.message.author.id);
				call.client.setTimeout(() => {
					module.exports.rateLimit.splice(module.exports.rateLimit.indexOf(call.message.author.id), 1);
				}, 300000);
			}).catch(() => {
				call.message.reply("Failed to give you Bro Bits.").catch(() => {});
			});
		} else {
			call.message.reply("You must wait 5 minutes from the last time you used the command.").catch(() => {
				call.message.author.send(`You attempted to run the \`loot\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
