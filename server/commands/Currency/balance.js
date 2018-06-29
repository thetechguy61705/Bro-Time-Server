module.exports = {
	id: "balance",
	description: "Returns a user's Bro Bit balance.",
	paramsHelp: "[user]",
	aliases: ["bal"],
	access: "Public",
	execute: (call) => {
		var param = call.params.readParameter(true);
		param = (param != null) ? param.toLowerCase() : null;
		var target = (call.message.channel.type === "text") ? call.message.guild.members.find((member) => (param || "").includes(member.id) || member.user.tag.toLowerCase().startsWith(param)) : null;
		target = (target != null) ? target.user : call.message.author;
		call.getWallet(target.id).getTotal().then((total) => {
			call.message.channel.send(target.tag + " has " + total + " Bro Bits.");
		}).catch(() => {
			call.safeSend("Failed to retrieve " + target.tag + "'s balance.");
		});
	}
};
