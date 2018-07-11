const Moderator = require("app/moderator");

module.exports = {
	id: "ban",
	description: "Bans specified user.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	botRequires: ["BAN_MEMBERS"],
	botRequiresMessage: "To ban members.",
	access: "Server",
	execute: async (call) => {
		const rawContent = call.params.readRaw(),
			parameterOne = (call.params.readParam() || ""),
			parameterTwo = (call.params.readParam() || "");
		if (Moderator(call.message.member)) {
			const target = call.message.guild.members.find((m) => parameterOne.includes(`${m.user.id}`));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason = (parameterTwo !== "") ? "`" + rawContent.substr(parameterOne.length + 1) + "`" : "`No reason specified.`";
					if (target.bannable) {
						try {
							await target.send(`You have been banned from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch (err) {
							console.warn(err.stack);
						}

						target.ban({ days:7, reason:`Banned by ${call.message.author.tag} for ${reason}` }).then(() => {
							call.message.channel.send(`***Successfully banned \`${target.user.tag}\`.***`);
						}).catch(() => {
							call.message.channel.send(`Failed to ban \`${target.user.tag}\`.`);
						});
					} else call.safeSend("I do not have permission to ban this user.");
				} else call.safeSend("That user is too far up in this guild's hierarchy to be banned by you.");
			} else call.safeSend("Please mention or supply the id of a valid user.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
