const Moderator = require("app/moderator");

module.exports = {
	id: "ban",
	description: "Bans specified user.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	execute: async (call) => {
		const rawContent = call.params.readRaw(),
			parameterOne = call.params.readParameter(),
			parameterTwo = call.params.readParameter();
		if (Moderator(call.message.member)) {
			const target = call.message.guild.members.find((m) => parameterOne.includes(`${m.user.id}`));
			if (target !== null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason = (parameterTwo != undefined) ? "`" + rawContent.substr(parameterOne.length + 1) + "`" : "`No reason specified.`";
					if (target.bannable) {
						try {
							await target.send(`You have been banned from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch(err) {
							console.warn(err.stack);
						}

						target.ban({ days:7, reason:`Banned by ${call.message.author.tag} for ${reason}` }).then(() => {
							call.message.channel.send(`***Successfully banned \`${target.user.tag}\`.***`);
						}).catch(() => {
							call.message.channel.send(`Failed to ban \`${target.user.tag}\`.`);
						});
					} else {
						call.message.reply("I do not have permission to ban this user.").catch(() => {
							call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`);
						});
					}
				} else {
					call.message.reply("That user is too far up in this guild's hierarchy to be banned by you.").catch(() => {
						call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`);
					});
				}
			} else {
				call.message.reply("Please mention or supply the id of a valid user.").catch(() => {
					call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`);
				});
			}
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`);
			});
		}
	}
};
