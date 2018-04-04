module.exports = {
	id: "mt",
	load: () => {},
	execute: (call) => {
		let role = call.params.readRole();
		if(call.message.member.roles.some(r=>["330919872630358026", "402175094312665098", "395265037356236810", "387768886096953355"].includes(r.id)) ) {
			if (!role) return call.message.reply("Invalid role. Please try again.").catch(() => {
				call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`)
					.catch(function(){});
			});
			role.setMentionable(!role.mentionable).then(() => {
				call.message.delete().catch(function(){});
			}).catch(() => {
				call.message.reply(`There was an error toggling the mentionability of the role \`${role.name}\`.`).catch(()=> {
					call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`)
						.catch(function(){});
				});
			});
		} else {
			call.message.reply("You do not have permission to use this command!").catch(() => {
				call.message.author.send(`You attempted to use the \`mt\` command in ${call.message.channel}, but I do not have permission to chat there.`)
					.catch(function(){});
			});
		}
	}
};
