/**
* Success rate (of gaining money): 40%
* Input multiplying rate (when gaining money): 60% - 140%
*/

module.exports = {
	id: "gamble",
	aliases: ["bet"],
	description: "Allows you to either lose all the bet money, or gain some more money.",
	paramsHelp: "(amount)",
	params: [
		{
			type: async (input, call) => {
				var userBalance = await call.getWallet(call.message.author.id).getTotal();
				var num = Number(input);
				if (!isNaN(num) && num > 0 && num <= userBalance)
					return num;
			},
			greedy: false,
			failure: "Please specify a valid amount to bet. It must be above 0 and less than or equal to your balance.",
			required: true
		}
	],
	access: "Public",
	exec: async (call) => {
		var amountToBet = call.parameters[0];
		var randomSuccess = (Math.random() * 10) < 4;
		var randomMultiplier = (Math.random() * 0.8) + 0.6;
		if (randomSuccess) {
			call.getWallet(call.message.author.id).change(Math.round(amountToBet * randomMultiplier)).then(() => {
				call.message.reply(`You gained ${Math.round(amountToBet * randomMultiplier)} Bro Bits. :D`).catch(() => {});
			}).catch(() => {
				call.safeSend("Failed to change your balance. You did not gain/lose any Bro Bits.");
			});
		} else {
			call.getWallet(call.message.author.id).change(-amountToBet).then(() => {
				call.message.reply(`You lost ${amountToBet} Bro Bits. D:`);
			}).catch(() => {
				call.safeSend("Failed to change your balance. You did not gain/lose any Bro Bits.");
			});
		}
	}
};
