module.exports = {
	id: "loot",
	description: "Gives you a random amount of Bro Bits.",
	rateLimit: [],
	execute: (call) => {
		if (module.exports.rateLimit.indexOf(call.message.author.id) === -1) {
			var randomBits = Math.ceil(Math.random() * 20);
			call.getWallet(call.message.author.id).change(randomBits).then(() => {
				call.message.reply("You looted " + randomBits + " Bro Bits!").catch(() => {});
				module.exports.rateLimit.push(call.message.author.id);
				console.log(module.exports.rateLimit);
				call.client.setTimeout(() => {
					module.exports.rateLimit.splice(module.exports.rateLimit.indexOf(call.message.author.id), 1);
				}, 300000);
			}).catch(() => {
				call.message.reply("Failed to give you Bro Bits.").catch(() => {});
			});
		}
	}
};
