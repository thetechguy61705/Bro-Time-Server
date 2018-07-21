const Moderator = require("@utility/moderator");

module.exports = {
	id: "softban",
	description: "Bans specified user, purging the messages they sent in the last seven days, then unbans the user. Basically rendering this as a kick.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	botRequires: ["BAN_MEMBERS"],
	botRequiresMessage: "To ban members and unban them.",
	access: "Server",
	exec: async (call) => {
<<<<<<< HEAD
		var param = call.params.readParam() || "";
=======
		const rawContent = call.params.readRaw(),
			parameterOne = (call.params.readParam() || ""),
			parameterTwo = (call.params.readParam() || "");
>>>>>>> 1b1d5d06071a35256de9626bbf4e936614e35f11
		if (Moderator(call.message.member)) {
			var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			var target = guild.members.find((m) => param.includes(`${m.user.id}`));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason = call.params.readParam(true) || "No reason specified.";
					if (target.bannable) {
						try {
							await target.send(`You have been softbanned/kicked from the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch (err) {
							console.warn(err.stack);
						}

						guild.ban(target, { days: 7, reason: `Softbanned by ${call.message.author.tag} for ${reason}` }).then(() => {
							guild.unban(target.user, `Softbanned by ${call.message.author.tag} for ${reason}`).then((user) => {
								call.message.channel.send(`***Successfully softbanned \`${user.tag}\`.***`);
							}).catch(() => {
								call.message.reply(`Failed to unban \`${target.user.tag}\`.`);
							});
						}).catch(() => {
							call.message.channel.send(`Failed to ban \`${target.user.tag}\`.`);
						});
					} else call.safeSend("I do not have permission to ban this user.");
				} else call.safeSend("That user is too far up in this guild's hierarchy to be banned by you.");
			} else call.safeSend("Please mention or supply the id of a valid user.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
