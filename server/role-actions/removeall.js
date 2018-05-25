module.exports = {
	run: (call) => {
		const parameter = call.params.readParameter(),
			target = (parameter != null) ?call.message.guild.members.find(member => parameter.includes(member.user.id) || member.user.tag.startsWith(parameter)) : null;
		if (target != null) {
			const rolesToRemove = target.roles
				.filter(role => call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position && role.name !== "@everyone");
			if (rolesToRemove.size !== 0) {
				target.removeRoles(removeAllRoles).then(() => {
					call.message.channel.send(`Role(s) removed from \`${target.user.tag}\`: \`${removeAllRoles.map(rM => rM.name).join("`, `")}\``)
						.catch(() => {});
				}).catch(() => {
					call.message.reply("There was an error removing roles from that user.").catch(() => {
						call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				});
			} else {
				call.message.reply("There are no roles that you can remove from this user.").catch(() => {
					call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("Please specify a valid user.").catch(() => {
				call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
}
