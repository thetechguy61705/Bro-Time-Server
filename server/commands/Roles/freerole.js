const FREE_ROLES = ["QOTD", "ANN", "GW", "MOVIES"];

module.exports = {
	id: "freerole",
	description: "Gives the user the specified role if it is QOTD, ANN or GW.",
	paramsHelp: "(ANN/GW/QoTD/Movies)",
	access: "Server",
	botRequires: ["MANAGE_ROLES"],
	botRequiresMessage: "To give freeroles.",
	execute: (call) => {
		const FREE_ROLE = call.params.readRole();
		if (FREE_ROLE != null && FREE_ROLES.includes(FREE_ROLE.name.toUpperCase())) {
			if (call.message.member.roles.has(FREE_ROLE.id)) {
				call.message.member.removeRole(FREE_ROLE).then(() => {
					call.message.reply(`Successfully removed the \`${FREE_ROLE.name}\` free role from you.`).catch(() => {
						call.message.author.send(`Successfully removed the \`${FREE_ROLE.name}\` free role from you.`);
					});
				}).catch(() => {
					call.message.reply(`Unable to remove the \`${FREE_ROLE.name}\` free role from you.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${FREE_ROLE.name}\` free role from you.`);
					});
				});
			} else {
				call.message.member.addRole(FREE_ROLE).then(() => {
					call.message.reply(`Successfully added the \`${FREE_ROLE.name}\` free role to you.`).catch(() => {
						call.message.author.send(`Successfully added the \`${FREE_ROLE.name}\` free role to you.`);
					});
				}).catch(() => {
					call.message.reply(`Unable to add the \`${FREE_ROLE.name}\` free role to you.`).catch(() => {
						call.message.author.send(`Unable to add the \`${FREE_ROLE.name}\` free role to you.`);
					});
				});
			}
		} else call.safeSend("Please specify a valid freerole option. Freeroles: `" + FREE_ROLE.join("`, `") + "`.");
	}
};
