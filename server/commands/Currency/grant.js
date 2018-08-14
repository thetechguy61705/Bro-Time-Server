const GRANTERS = ["236341625763135500", "245877990938902529", "432650511825633317", "433065327836790784"];
const { GuildMember } = require("discord.js");

module.exports = {
	id: "grant",
	description: "Force give/take away Bro Bits to/from a user.",
	paramsHelp: "(user) (amount)",
	requires: "Role: Co-Owner Bro, Owner Bro",
	params: [
		{
			type: async (input, call) => {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				// eslint-disable-next-line no-unreachable
				return guild.members.find((m) => input.includes(m.user.id) || m.user.tag.toLowerCase().startsWith(input.toLowerCase()))
					|| await call.client.fetchUser(input);
			},
			greedy: false,
			failure: "You did not specify a valid user.",
			required: true
		},
		{
			type: "number",
			greedy: false,
			failure: "You did not specify a valid amount to give to the user.",
			required: true,
		}
	],
	access: "Public",
	exec: async (call) => {
		if (GRANTERS.includes(call.message.author.id)) {
			var target = call.parameters[0];
			var amount = call.parameters[1];
			if (target instanceof GuildMember) target = target.user;
			call.getWallet(target.id).change(amount).then(() => {
				call.message.channel.send(`Changed ${target.tag}'s balance by ${amount}`);
			}).catch(() => {
				call.message.channel.send(`Failed to change ${target.tag}'s balance by ${amount}`);
			});
		} else call.safeSend("You do not have permissions to use this command.");
	}
};
