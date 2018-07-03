const { GuildMember } = require("discord.js");

module.exports = {
	id: "balance",
	description: "Returns a user's Bro Bit balance.",
	paramsHelp: "[user]",
	aliases: ["bal", "money", "b"],
	access: "Public",
	execute: async (call) => {
		var param = call.params.readRaw();
		param = (param !== "" && param != null) ? param.toLowerCase() : null;
		var target;
		try {
			if (call.message.channel.type === "text") {
				target = call.params.readMember() ||
					await call.client.fetchUser(param || call.message.author.id);
			} else {
				target = await call.client.fetchUser(param || call.message.author.id);
			}
		} catch (exc) {
			console.warn(exc.stack);
		}
		target = (target != null) ? ((target instanceof GuildMember) ? target.user : target) : call.message.author;
		call.getWallet(target.id).getTotal().then((total) => {
			call.message.channel.send(target.tag + " has " + total + " Bro Bits.");
		}).catch(() => {
			call.safeSend("Failed to retrieve " + target.tag + "'s balance.");
		});
	}
};
