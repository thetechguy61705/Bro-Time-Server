const OWNERS = ["236341625763135500", "245877990938902529", "432650511825633317"];

module.exports = {
	id: "grant",
	execute: (call) => {
		if (OWNERS.includes(call.message.author.id)) {
			var param = call.params.readParameter();
			param = (param != null) param.toLowerCase(): "";
			const TARGET = call.message.guild.members.find((member) => param.includes(member.id) || param === member.user.tag),
				AMOUNT = Number(call.params.readParameter());

			if (TARGET != null) {
				if (AMOUNT != null && AMOUNT !== NaN) {
					call.getWallet(TARGET.id).change()
				}
			}
		} else {
			call.message.reply("You do not have permissions to use this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`grant\` command in ${call.message.channel}, but I can not chat there.`)
					.catch(() => {}); 
			});
		}
	}
};
