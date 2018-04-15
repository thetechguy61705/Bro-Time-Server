module.exports = {
	id: "kick",
	load: () => {},
	execute: (call) => {
		const rawContent = call.params.readRaw();
		const parameterOne = rawContent.split(" ")[0];
		const parameterTwo = rawContent.split(" ")[1];
		if (call.message.member.roles.some(role => ["330919872630358026", "402175094312665098", "395265037356236810", "387768886096953355"].includes(role.id))) {
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
							target.kick().then(() => {
								call.message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`).then(msg => msg.delete(5000).catch(function() {}));
							}).catch(() => {
								call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`).then(msg => msg.delete(5000).catch(function() {}));
							});
						}).catch(() => {
							target.kick().then(() => {
								call.message.channel.send(`***Successfully kicked \`${target.user.tag}\`.***`).then(msg => msg.delete(5000).catch(function() {}));
							}).catch(() => {
								call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`).then(msg => msg.delete(5000).catch(function() {}));
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
