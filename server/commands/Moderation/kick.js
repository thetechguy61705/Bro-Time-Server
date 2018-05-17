module.exports = {
	id: "kick",
	description: "Kicks specified user.",
	arguments: "(user) [reason]",
	requires: "Moderator permissions",
	execute: (call) => {
		const rawContent = call.params.readRaw();
		const parameterOne = rawContent.split(" ")[0];
		const parameterTwo = rawContent.split(" ")[1];
		const modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		if (call.message.member.roles.some(role => modRoles.includes(role.id))) {
			const target = call.message.guild.members.find(m => parameterOne.includes(`${m.user.id}`));
			if (target !== null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason;
					if (parameterTwo != undefined) {
						reason = "`" + rawContent.substr(parameterOne.length + 1) + "`";
					} else {
						reason = "`No reason specified.`";
					}
					if (target.kickable) {
						target.send(`You have been kicked from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`).then(() => {
							target.kick(`Kicked by ${call.message.author.tag} for ${reason}`).then(() => {
								call.message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`).catch(function() {});
							}).catch(() => {
								call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`).catch(function() {});
							});
						}).catch(() => {
							target.kick(`Kicked by ${call.message.author.tag} for ${reason}`).then(() => {
								call.message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`).catch(function() {});
							}).catch(() => {
								call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`).catch(function() {});
							});
						});
					} else {
						call.message.reply("I do not have permission to kick this user.").catch(() => {
							call.message.author.send(`You attempted to use the \`kick\` command in ${call.message.channel}, but I can not chat there.`)
								.catch(function() {});
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
