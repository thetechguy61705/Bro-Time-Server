const Moderator = require("@utility/moderator");

module.exports = {
	id: "softban",
	description: "Bans specified user, purging the messages they sent in the last seven days, then unbans the user. Basically rendering this as a kick.",
	paramsHelp: "(user) [days to delete messages] [reason]",
	requires: "Moderator permissions",
	botRequires: ["BAN_MEMBERS"],
	botRequiresMessage: "To ban members and unban them.",
	access: "Server",
	exec: async (call) => {
		var param = call.params.readParam() || "";
		if (Moderator(call.message.member)) {
			var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			var target = guild.members.find((m) => param.includes(`${m.user.id}`));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var daysToDelete = call.params.readNumber(false);
					if (daysToDelete != null) {
						call.params.offset(daysToDelete.toString().length + 1);
						daysToDelete = daysToDelete < 0 ? 0 : daysToDelete > 7 ? 7 : daysToDelete;
					} else daysToDelete = 7;
					var reason = call.params.readParam(true) || "No reason specified.";
					if (target.bannable) {
						try {
							await target.send(`You have been softbanned/kicked from the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch (err) {
							console.warn(err.stack);
						}

						guild.ban(target, { days: daysToDelete, reason: `Softbanned by ${call.message.author.tag} for ${reason}` }).then(() => {
							guild.unban(target.user, `Softbanned by ${call.message.author.tag} for ${reason}`).then((user) => {
								call.message.channel.send(`***Successfully softbanned \`${user.tag || user.id || user}\`.***`);
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
