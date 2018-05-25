module.exports = {
	run: (call) => {
		const paramOne = call.params.readParameter(),
			target = (paramOne != null) ? call.message.guild.roles.find(role => role.id === paramOne || role.name.toLowerCase().startsWith(paramOne.toLowerCase())) : null;
		var rolesToChange = { rolesToAdd: [], rolesToRemove: [] };
		if (target != null) {
			(call.params.readParameter(true) || "").split(",").forEach(role => {
				const ammToSlice = (role.trim().startsWith("+") || role.trim().startsWith("-")) ? 1 : 0;
				var newRole = call.message.guild.roles
					.find(r => r.id === role.trim().slice(ammToSlice) || r.name.toLowerCase().startsWith(role.trim().slice(ammToSlice).toLowerCase()));
				if (newRole != null && newRole.position < call.message.member.highestRole.position && newRole.position < call.message.guild.me.highestRole.position) {
					if (role.trim().startsWith("-")) rolesToChange.rolesToRemove.push(newRole);
					else rolesToChange.rolesToAdd.push(newRole);
				}
			});
			if (rolesToChange.rolesToAdd.concat(rolesToChange.rolesToRemove).length !== 0) {
				call.message.channel.send("Changing roles for people in the `" + target.name + "` role.")
					.catch(() => call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {}));
				target.members.forEach(member => {
					rolesToChange.rolesToRemove.forEach((role) => {
						member.removeRole(role);
					});
					rolesToChange.rolesToAdd.forEach((role) => {
						member.addRole(role);
					});
				});
			} else {
				call.message.reply("No valid roles were specified. Roles that are above your or my hierarchy can not be changed.").catch(() => {
					call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("Please specify a valid role.").catch(() => {
				call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
