const FREE_ROLES = ["QOTD", "ANN", "GW", "MOVIES"];

module.exports = {
	id: "freerole",
	description: "Gives the user the specified role if it is QOTD, ANN or GW.",
	paramsHelp: "(ANN/GW/QoTD/Movies)",
	access: "Server",
	botRequires: ["MANAGE_ROLES"],
	botRequiresMessage: "To give freeroles.",
	execute: (call) => {
		var role = call.params.readRole();
		if (role != null && FREE_ROLES.includes(role.name.toUpperCase())) {
			if (call.message.member.roles.has(role.id)) {
				call.message.member.removeRole(role).then(() => {
					call.message.reply(`Successfully removed the \`${role.name}\` free role from you.`).catch(() => {
						call.message.author.send(`Successfully removed the \`${role.name}\` free role from you.`);
					});
				}).catch(() => {
					call.message.reply(`Unable to remove the \`${role.name}\` free role from you.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${role.name}\` free role from you.`);
					});
				});
			} else {
				call.message.member.addRole(role).then(() => {
					call.message.reply(`Successfully added the \`${role.name}\` free role to you.`).catch(() => {
						call.message.author.send(`Successfully added the \`${role.name}\` free role to you.`);
					});
				}).catch(() => {
					call.message.reply(`Unable to add the \`${role.name}\` free role to you.`).catch(() => {
						call.message.author.send(`Unable to add the \`${role.name}\` free role to you.`);
					});
				});
			}
		} else call.safeSend("Please specify a valid freerole option. Freeroles: `" + FREE_ROLES.join("`, `") + "`.");
	}
};
