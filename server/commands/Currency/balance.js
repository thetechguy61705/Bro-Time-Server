const { GuildMember } = require("discord.js");

module.exports = {
	id: "balance",
	description: "Returns a user's Bro Bit balance.",
	paramsHelp: "[user]",
	aliases: ["bal", "money", "b"],
	params: [
		{
			type: async (input, call) => {
				if (call.message.channel.type === "text") {
					await call.message.guild.fetchMembers("", call.message.guild.memberCount);
					return call.params.readMember() ||
						await call.client.fetchUser(input || call.message.author.id, false);
				} else {
					return await call.client.fetchUser(input || call.message.author.id);
				}
			},
			greedy: true,
			default: (call) => call.message.author,
			required: false
		}
	],
	access: "Public",
	exec: async (call) => {
		var target = call.parameters[0];
		if (target instanceof GuildMember) target = target.user;
		call.getWallet(target.id).getTotal().then((total) => {
			call.message.channel.send(`${target.tag} has ${total} Bro Bits.`);
		}).catch(() => {
			call.safeSend(`Failed to retrieve ${target.tag}'s balance.`);
		});
	}
};
