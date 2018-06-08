const Moderator = require("app/moderator");

module.exports = {
	id: "kick",
	description: "Kicks specified user.",
	arguments: "(user) [reason]",
	requires: "Moderator permissions",
	execute: (call) => {
		const rawContent = call.params.readRaw(),
			parameterOne = call.params.readParameter(),
			parameterTwo = call.params.readParameter();
		if (Moderator(call.message.member)) {
			const target = call.message.guild.members.find((m) => parameterOne.includes(`${m.user.id}`));
			if (target !== null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason = (parameterTwo != null) ? "`" + rawContent.substr(parameterOne.length + 1) + "`" : "`No reason specified.`";
					if (target.kickable) {
						try {
							await target.send(`You have been kicked from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch(err) {
							console.warn(err.stack);
						}

					]	target.kick(`Kicked by ${call.message.author.tag} for ${reason}`).then(() => {
							call.message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`).catch(function() {});
						}).catch(() => {
							call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`).catch(function() {});
						});
					} else {
						call.message.reply("I do not have permission to kick this user.").catch(() => {
							call.message.author.send(`You attempted to use the \`kick\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				} else {
					call.message.reply("That user is too far up in this guild's hierarchy to be kicked by you.").catch(() => {
						call.message.author.send(`You attempted to use the \`kick\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				call.message.reply("Please mention or supply the id of a valid user.").catch(() => {
					call.message.author.send(`You attempted to use the \`kick\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`kick\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
