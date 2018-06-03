module.exports = {
	id: "balance",
	aliases: ["bal"],
	execute: (call) => {
		var param = call.params.readParameter();
		param = (param != null) ? param.toLowerCase() : null;
		var target = call.message.guild.members.find((member) => param.includes(member.id) || member.user.tag.toLowerCase().startsWith(param));
		target = (target != null) ? target : call.message.member;
		call.getWallet(target.id).getTotal().then((total) => {
			call.message.channel.send(target.user.tag + " has " + total + " Bro Bits.").catch(() => {});
		});
	}
};
