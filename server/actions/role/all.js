module.exports = {
	id: "all",
	aliases: ["everyone"],
	run: (call) => {
		const greedyParam = call.params.readParam(true), roles = (greedyParam != null) ? greedyParam.split(",") : [];
		var rolesToChange = { rolesToAdd: [], rolesToRemove: [] };
		for (let role of roles) {
			const ammToSlice = (role.trim().startsWith("+") || role.trim().startsWith("-")) ? 1 : 0;
			var newRole = call.message.guild.roles
				.find((r) => r.id === role.trim().slice(ammToSlice) || r.name.toLowerCase().startsWith(role.trim().slice(ammToSlice).toLowerCase()));
			if (newRole != null && newRole.position < call.message.member.highestRole.position && newRole.editable) {
				if (role.trim().startsWith("-")) rolesToChange.rolesToRemove.push(newRole);
				else rolesToChange.rolesToAdd.push(newRole);
			}
		}
		if (rolesToChange.rolesToAdd.concat(rolesToChange.rolesToRemove).length !== 0) {
			call.message.channel.send("Changing roles for everyone in this guild.");
			for (var member of call.message.guild.members.array()) {
				for (let role of rolesToChange.rolesToRemove)
					member.removeRole(role);
				for (let role of rolesToChange.rolesToAdd)
					member.addRole(role);
			}
		} else call.safeSend("No valid roles were specified. Roles that are above your or my hierarchy can not be changed.");
	}
};
