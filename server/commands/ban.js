module.exports = {
	id: "ban",
	load: () => {},
	execute: (call) => {
		const rawContent = call.params.readRaw();
		console.log(`RAW CONTENT: ${rawContent}`);
		const parameterOne = rawContent.split(" ")[0];
		console.log(`PARAM 1: ${parameterOne}`);
		const parameterTwo = rawContent.split(" ")[1];
		console.log(`PARAM 2: ${parameterTwo}`);
		if (call.message.member.roles.some(role => ["330919872630358026", "402175094312665098", "395265037356236810", "387768886096953355"].includes(role.id))) {
			const target = call.message.guild.members.find(m => parameterOne.includes(`${m.user.id}`));
			var reason;
			if (parameterTwo != undefined) {
				reason = "`" + rawContent.substr(parameterOne.length + 1) + "`";
			} else {
				reason = "`No reason specified.`";
			}
			if (target != undefined) {
				if (target.bannable) {
					target.send(`You have been banned from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`).then(() => {
						target.ban(7).then(() => {
							call.message.channel.send(`***Successfully banned \`${target.user.tag}\`.***`).then(msg => msg.delete(5000).catch(function() {}));
						}).catch(() => {
							call.message.channel.send(`Failed to ban \`${target.user.tag}\`.`).then(msg => msg.delete(5000).catch(function() {}));
						});
					}).catch(() => {
						target.ban(7).then(() => {
							call.message.channel.send(`***Successfully banned \`${target.user.tag}\`.***`).then(msg => msg.delete(5000).catch(function() {}));
						}).catch(() => {
							call.message.channel.send(`Failed to ban \`${target.user.tag}\`.`).then(msg => msg.delete(5000).catch(function() {}));
						});
					});
				} else {
					call.message.channel.send("I do not have permission to ban this user.").catch(() => {
						call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				call.message.reply("Please mention or supply the id of a valid user.").catch(() => {
					call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`ban\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
