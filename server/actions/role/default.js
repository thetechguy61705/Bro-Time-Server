module.exports = {
	id: "default",
	run: (call, actions, parameter) => {
		const target = (parameter != "" && parameter != null) ?
			call.message.guild.members.find((member) => member.user.tag.toLowerCase().startsWith(parameter.toLowerCase()) ||
				parameter.includes(member.user.id)) :
			null;
		var rolesToChange = { rolesToAdd: [], rolesToRemove: [] };
		if (target != null) {
			for (let role of (call.params.readParam(true) || "").split(",")) {
				const ammToSlice = (role.trim().startsWith("+") || role.trim().startsWith("-")) ? 1 : 0;
				var newRole = call.message.guild.roles
					.find((r) => r.id === role.trim().slice(ammToSlice) || r.name.toLowerCase().startsWith(role.trim().slice(ammToSlice).toLowerCase()));
				if (newRole != null && newRole.position < call.message.member.highestRole.position && newRole.editable) {
					if (role.trim().startsWith("-")) rolesToChange.rolesToRemove.push(newRole);
					else {
						if (target.roles.keyArray().includes(newRole.id) && !role.trim().startsWith("+")) rolesToChange.rolesToRemove.push(newRole);
						else rolesToChange.rolesToAdd.push(newRole);
					}
				}
			}

			if (rolesToChange.rolesToAdd.concat(rolesToChange.rolesToRemove).length !== 0) {
				call.message.channel.send("Changing roles for `" + target.user.tag + "`.");
				for (let role of rolesToChange.rolesToRemove)
					target.removeRole(role);
				for (let role of rolesToChange.rolesToAdd)
					target.addRole(role);
			} else call.safeSend("No valid roles were specified. Roles that are above your or my hierarchy can not be changed.");
		} else call.safeSend("Invalid parameter option. Parameter options: `" + actions.keyArray().join("`, `") + "`.");
	}
};
