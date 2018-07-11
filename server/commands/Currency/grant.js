const GRANTERS = ["236341625763135500", "245877990938902529", "432650511825633317", "433065327836790784"];
const { GuildMember } = require("discord.js");

module.exports = {
	id: "grant",
	description: "Force give/take away Bro Bits to/from a user.",
	paramsHelp: "(user) (amount)",
	requires: "Role: Co-Owner Bro, Owner Bro",
	access: "Public",
	execute: async (call) => {
		if (GRANTERS.includes(call.message.author.id)) {
			var param = call.params.readParam();
			param = (param != null) ? param.toLowerCase() : "";
			var target;
			var failed;
			try {
				if (call.message.channel.type === "text") {
					target = call.message.guild.members.find((member) => (param || "").includes(member.id) || member.user.tag.toLowerCase().startsWith(param)) ||
						await call.client.fetchUser(param || "nothing");
				} else {
					target = await call.client.fetchUser(param || "nothing");
				}
			} catch (exc) {
				console.warn(exc.stack);
				failed = exc.message;
			}
			var amount = call.params.readNumber();
			if (target instanceof GuildMember) target = target.user;
			if (target != null && !failed) {
				if (amount != null && !isNaN(amount)) {
					call.getWallet(target.id).change(amount).then(() => {
						call.message.channel.send(`Changed ${target.tag}'s balance by ${amount}`);
					}).catch(() => {
						call.message.channel.send(`Failed to change ${target.tag}'s balance by ${amount}`);
					});
				} else call.safeSend("You did not specify a valid amount to give to the user.");
			} else call.safeSend("You did not specify a valid user.");
		} else call.safeSend("You do not have permissions to use this command.");
	}
};
