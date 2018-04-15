module.exports = {
	id: "ban",
	load: () => {},
	execute: (call) => {
		const parameterOne = call.params.readParameter();
		const parameterTwo = call.params.readParameter();
		if (call.message.member.roles.some(role => ["330919872630358026", "402175094312665098", "395265037356236810", "387768886096953355"].includes(role.id))) {
			const target = call.message.guild.members.find(m => parameterOne.includes(`${m.user.id}`));
			var reason;
			if (parameterTwo != "" && parameterTwo != undefined) {
				reason = call.params.readRaw().substr(parameterOne.length + 1);
			} else {
				reason = "No reason specified.";
			}
			if (target != undefined) {
				target.send(`You have been banned from the ${call.message.guild.name} Discord server by ${call.message.author} for ${reason}`);
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
