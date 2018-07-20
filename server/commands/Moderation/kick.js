const Moderator = require("@utility/moderator");

module.exports = {
	id: "kick",
	description: "Kicks specified user.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	botRequires: ["KICK_MEMBERS"],
	botRequiresMessage: "To kick members.",
	access: "Server",
	exec: async (call) => {
		const rawContent = call.params.readRaw(),
			parameterOne = (call.params.readParam() || ""),
			parameterTwo = (call.params.readParam() || "");
		if (Moderator(call.message.member)) {
			var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			const target = guild.members.find((m) => parameterOne.includes(`${m.user.id}`));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason = (parameterTwo !== "") ? "`" + rawContent.substr(parameterOne.length + 1) + "`" : "`No reason specified.`";
					if (target.kickable) {
						try {
							await target.send(`You have been kicked from the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch (err) {
							console.warn(err.stack);
						}

						target.kick(`Kicked by ${call.message.author.tag} for ${reason}`).then(() => {
							call.message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`);
						}).catch(() => {
							call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`);
						});
					} else call.safeSend("I do not have permission to kick this user.");
				} else call.safeSend("That user is too far up in this guild's hierarchy to be kicked by you.");
			} else call.safeSend("Please mention or supply the id of a valid user.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
