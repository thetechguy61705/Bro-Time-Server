const OWNERS = ["236341625763135500", "245877990938902529", "432650511825633317"];

module.exports = {
	id: "grant",
	description: "Force give/take away Bro Bits to/from a user.",
	paramsHelp: "(user) (amount)",
	requires: "Role: Co-Owner Bro, Owner Bro",
	execute: (call) => {
		if (OWNERS.includes(call.message.author.id)) {
			var param = call.params.readParameter();
			param = (param != null) ? param.toLowerCase() : "";
			const TARGET = call.message.guild.members.find((member) => param.includes(member.id) || param === member.user.tag.toLowerCase()),
				AMOUNT = Number(call.params.readParameter());

			if (TARGET != null) {
				if (AMOUNT != null && !isNaN(AMOUNT)) {
					call.getWallet(TARGET.id).change(AMOUNT).then(() => {
						call.message.channel.send(`Changed ${TARGET.user.tag}'s balance by ${AMOUNT}`);
					}).catch(() => {
						call.message.channel.send(`Failed to change ${TARGET.user.tag}'s balance by ${AMOUNT}`);
					});
				} else {
					call.message.reply("You did not specify a valid amount to give to the user.").catch(() => {
						call.message.author.send(`You attempted to use the \`grant\` command in ${call.message.channel}, but I can not chat there.`);
					});
				}
			} else {
				call.message.reply("You did not specify a valid user.").catch(() => {
					call.message.author.send(`You attempted to use the \`grant\` command in ${call.message.channel}, but I can not chat there.`);
				});
			}
		} else {
			call.message.reply("You do not have permissions to use this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`grant\` command in ${call.message.channel}, but I can not chat there.`);
			});
		}
	}
};
