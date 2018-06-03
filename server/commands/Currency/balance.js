module.exports = {
	id: "balance",
	aliases: ["bal"],
	execute: (call) => {
		var param = call.params.readParameter();
		param = (param != null) ? param.toLowerCase() : "";
		var target = call.message.guild.members.find((member) => param.includes(member.id) || param === member.user.tag.toLowerCase());
		target = (target != null) ? target : call.message.author;
		call.getWallet(TARGET.id).getTotal().then((total) => {
			call.message.channel.send(TARGET.user.tag + " has " + total + " Bro Bits.").catch(() => {});
		});
	}
};
