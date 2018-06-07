module.exports = {
	id: "softban",
	description: "Bans specified user, purging the messages they sent in the last seven days, then unbans the user. Basically rendering this as a kick.",
	arguments: "(user) [reason]",
	requires: "Moderator permissions",
	botRequires: "BAN_MEMBERS",
	botRequiresMessage: "To be able to ban users.",
	userRequires: "BAN_MEMBERS",
	userRequiresMessage: "To be able to ban users.",
	execute: async (call) => {
		const rawContent = call.params.readRaw(),
			parameterOne = rawContent.split(" ")[0],
			parameterTwo = rawContent.split(" ")[1],
			modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		if (call.message.member.roles.some((role) => modRoles.includes(role.id))) {
			const target = call.message.guild.members.find((m) => parameterOne.includes(`${m.user.id}`));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason = (parameterTwo != null) ? "`" + rawContent.substr(parameterOne.length + 1) + "`" : "`No reason specified.`";
					if (target.bannable) {
						try {
							await target.send(`You have been softbanned/kicked from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch(_) {}
						target.ban({ days: 7, reason: `Banned by ${call.message.author.tag} for ${reason}` }).then(() => {
							call.message.guild.unban({ user: target.user, reason: `Softbanned by ${call.message.author.tag} for ${reason}` }).then(() => {
								call.message.channel.send(`***Successfully softbanned \`${target.user.tag}\`.***`).catch(() => {});
							}).catch(() => {
								call.message.reply(`Failed to unban \`${target.user.tag}\`.`).catch(() => {});
							});
						}).catch(() => {
							call.message.channel.send(`Failed to ban \`${target.user.tag}\`.`).catch(() => {});
						});
					} else {
						call.message.reply("I do not have permission to ban this user.").catch(() => {
							call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.message.reply("That user is too far up in this guild's hierarchy to be banned by you.").catch(() => {
						call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				call.message.reply("Please mention or supply the id of a valid user.").catch(() => {
					call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
