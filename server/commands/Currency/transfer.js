const { GuildMember } = require("discord.js");

module.exports = {
	id: "transfer",
	aliases: ["give", "t"],
	description: "Transfers Bro Bits from you to another user with a 90% exchange rate.",
	paramsHelp: "(user) (amount)",
	params: [
		{
			type: async (input, call) => {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				// eslint-disable-next-line no-unreachable
				return guild.members.find((m) => input.includes(m.user.id)) || await call.client.fetchUser(input);
			},
			greedy: false,
			failure: "Please specify a valid user to transfer Bro Bits to.",
			required: true
		},
		{
			type: async (input, call) => {
				var userBalance = await call.getWallet(call.message.author.id).getTotal();
				var num = Math.round(Number(input));
				if (!isNaN(num) && num > 0 && num <= userBalance)
					return num;
			},
			greedy: false,
			failure: "Please specify a valid amount to transfer. It must be above 0 and less than or equal to your balance.",
			required: true
		}
	],
	access: "Public",
	exec: async (call) => {
		var target = call.parameters[0];
		if (target instanceof GuildMember) target = target.user;
		var amount = call.parameters[1];
		call.getWallet(call.message.author.id).transfer(amount, target.id).then(() => {
			call.message.reply(`You have successfully given ${Math.ceil(amount * call.TRANSFER_RATE)} Bro Bits to ${target.tag}.`).catch(() => {});
		}).catch(() => {
			call.message.reply("Something went wrong in the transaction and I could not give the Bro Bits.");
		});
	}
};
