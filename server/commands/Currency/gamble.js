/*
Success rate (of gaining money): 40%
Input multiplying rate (when gaining money): 60% - 140%
*/

module.exports = {
	id: "gamble",
	aliases: ["bet"],
	description: "Allows you to either lose all the bet money, or gain some more money.",
	paramsHelp: "(amount)",
	access: "Public",
	execute: async (call) => {
		var userBalance = await call.getWallet(call.message.author.id).getTotal();
		var param = (call.params.readParameter() || "."), amountToBet = Math.ceil(Number(param) || param.toNumber(964));
		if (amountToBet != null && !isNaN(amountToBet) && amountToBet > 0) {
			if (amountToBet <= userBalance) {
				var randomSuccess = ((Math.random() * 10) < 4) ? true : false;
				var randomMultiplier = (Math.random() * 0.8) + 0.6;
				if (randomSuccess) {
					call.getWallet(call.message.author.id).change(Math.round(amountToBet * randomMultiplier)).then((d, e) => {
						console.log(d);
						console.log(e);
						call.message.reply("You gained " + Math.round(amountToBet * randomMultiplier) + " Bro Bits. :D").catch(() => {});
					}).catch(() => {
						call.safeSend("Failed to change your balance. You did not gain/lose any Bro Bits.");
					});
				} else {
					call.getWallet(call.message.author.id).change(-amountToBet).then(() => {
						call.message.reply("You lost " + amountToBet + " Bro Bits. D:");
					}).catch(() => {
						call.safeSend("Failed to change your balance. You did not gain/lose any Bro Bits.");
					});
				}
			} else call.safeSend("You do not have enough money to bet this amount.");
		} else call.safeSend("Please specify a valid amount to bet.");
	}
};
