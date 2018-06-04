module.exports = {
	id: "transfer",
	aliases: ["give"],
	description: "Transfers Bro Bits from you to another user with a 90% exchange rate.",
	arguments: "(user) (amount)",
	execute: async (call) => {
		var param = call.params.readParameter();
		param = (param != null) ? param.toLowerCase() : "";
		const TARGET = call.message.guild.members.find((member) => param.includes(member.user.id) || param.startsWith(member.user.tag.toLowerCase())),
			AMOUNT = Number(call.params.readParameter());
		if (TARGET != null) {
			if (AMOUNT != null && !isNaN(AMOUNT)) {
				if (AMOUNT >= 1) {
					var userBalance = await call.getWallet(call.message.author.id).getTotal();
					if (userBalance >= AMOUNT) {
						var targetBalance = await call.getWallet(TARGET.user.id).getTotal();
						if ((targetBalance + AMOUNT) < 1000000000) {
							call.getWallet(call.message.author.id).transfer(Math.round(AMOUNT), TARGET.user.id).then(() => {
								call.message.reply(`You have successfully given ${AMOUNT} Bro Bits to ${TARGET.user.tag}.`).catch(() => {});
							});
						} else {
							call.message.reply("This user has too much Bro Bits to recieve your transaction.").catch(() => {
								call.message.reply(`You attempted to use the \`transfer\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					} else {
						call.message.reply("You do not have enough Bro Bits to make this transaction.").catch(() => {
							call.message.reply(`You attempted to use the \`transfer\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.message.reply("Please specify a amount above 0.").catch(() => {
						call.message.reply(`You attempted to use the \`transfer\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				call.message.reply("Please specify a valid amount to give to this user.").catch(() => {
					call.message.reply(`You attempted to use the \`transfer\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("Please specify a valid user to transfer Bro Bits to.").catch(() => {
				call.message.reply(`You attempted to use the \`transfer\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
