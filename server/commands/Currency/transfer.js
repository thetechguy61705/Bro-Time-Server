module.exports = {
	id: "transfer",
	aliases: ["give"],
	description: "Transfers Bro Bits from you to another user with a 90% exchange rate.",
	paramsHelp: "(user) (amount)",
	access: "Server",
	execute: async (call) => {
		var param = call.params.readParameter();
		param = (param != null) ? param.toLowerCase() : null;
		const TARGET = call.message.guild.members.find((member) => (param || "").includes(member.user.id) || param.startsWith(member.user.tag.toLowerCase())),
			AMOUNT = Number(call.params.readParameter());
		if (TARGET != null) {
			if (AMOUNT != null && !isNaN(AMOUNT)) {
				if (AMOUNT >= 1) {
					var userBalance = await call.getWallet(call.message.author.id).getTotal();
					if (userBalance >= AMOUNT) {
						var targetBalance = await call.getWallet(TARGET.user.id).getTotal();
						if ((targetBalance + AMOUNT) < 1000000000) {
							call.getWallet(call.message.author.id).transfer(Math.round(AMOUNT), TARGET.user.id).then((d, e) => {
								console.log(d);
								console.log(e);
								call.message.reply(`You have successfully given ${Math.ceil(AMOUNT * call.TRANSFER_RATE)} Bro Bits to ${TARGET.user.tag}.`).catch(() => {});
							}).catch(() => {
								call.message.reply("Something went wrong in the transaction and I could not give the Bro Bits.");
							});
						} else call.safeSend("This user has too much Bro Bits to recieve your transaction.");
					} else call.safeSend("You do not have enough Bro Bits to make this transaction.");
				} else call.safeSend("Please specify a amount above 0.");
			} else call.safeSend("Please specify a valid amount to give to this user.");
		} else call.safeSend("Please specify a valid user to transfer Bro Bits to.");
	}
};
