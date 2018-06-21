module.exports = {
	id: "removeall",
	run: (call) => {
		const parameter = call.params.readParameter(),
			target = (parameter != null) ? call.message.guild.members.find((member) => parameter.includes(member.user.id) || member.user.tag.startsWith(parameter)) : null;
		if (target != null) {
			const rolesToRemove = target.roles
				.filter((role) => call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position && role.name !== "@everyone");
			if (rolesToRemove.size !== 0) {
				target.removeRoles(rolesToRemove).then(() => {
					call.message.channel.send("Removing all roles from `" + target.user.tag + "`.");
				}).catch(() => {
					call.safeSend("There was an error removing roles from that user.");
				});
			} else call.safeSend("There are no roles that you can remove from this user.");
		} else call.safeSend("Please specify a valid user.");
	}
};
