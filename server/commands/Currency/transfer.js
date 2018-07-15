const { GuildMember } = require("discord.js");

module.exports = {
	id: "transfer",
	aliases: ["give"],
	description: "Transfers Bro Bits from you to another user with a 90% exchange rate.",
	paramsHelp: "(user) (amount)",
	access: "Public",
	userType: "User",
	execute: async (call) => {
		var param = call.params.readParam();
		param = (param != null) ? param.toLowerCase() : null;
		var target;
		var failed = false;
		try {
			if (call.message.channel.type === "text") {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				target = guild.members.find((member) => (param || "").includes(member.id) || member.user.tag.toLowerCase().startsWith(param)) ||
					await call.client.fetchUser(param || "nothing");
			} else {
				target = await call.client.fetchUser(param || "nothing");
			}
		} catch (exc) {
			failed = exc.message;
		}
		var amount = Number(call.params.readParam());
		target = (target instanceof GuildMember) ? target.user : target;
		if (target != null && !failed) {
			if (amount != null && !isNaN(amount)) {
				if (amount >= 1) {
					var userBalance = await call.getWallet(call.message.author.id).getTotal();
					if (userBalance >= amount) {
						var targetBalance = await call.getWallet(target.id).getTotal();
						if ((targetBalance + amount) < 1000000000) {
							call.getWallet(call.message.author.id).transfer(Math.round(amount), target.id).then(() => {
								call.message.reply(`You have successfully given ${Math.ceil(amount * call.TRANSFER_RATE)} Bro Bits to ${target.tag}.`).catch(() => {});
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
