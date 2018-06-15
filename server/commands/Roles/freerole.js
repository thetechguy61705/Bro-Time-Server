const FREE_ROLES = ["QOTD", "ANN", "GW", "MOVIES"];

module.exports = {
	id: "freerole",
	description: "Gives the user the specified role if it is QOTD, ANN or GW.",
	paramsHelp: "(ANN/GW/QoTD/Movies)",
	execute: (call) => {
		const INPUT = call.params.readRaw().trim();
		if (FREE_ROLES.includes(INPUT.toUpperCase())) {
			const FREE_ROLE = call.message.guild.roles.find("name", INPUT.toUpperCase());
			if (call.message.member.roles.has(FREE_ROLE.id)) {
				call.message.member.removeRole(FREE_ROLE).then(() => {
					call.message.channel.send(`Successfully removed the \`${INPUT}\` free role from you.`).catch(() => {
						call.message.author.send(`Successfully removed the \`${INPUT}\` free role from you.`);
					});
				}).catch(() => {
					call.message.channel.send(`Unable to remove the \`${INPUT}\` free role from you.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${INPUT}\` free role from you.`);
					});
				});
			} else {
				call.message.member.addRole(FREE_ROLE).then(() => {
					call.message.channel.send(`Successfully added the \`${INPUT}\` free role to you.`).catch(() => {
						call.message.author.send(`Successfully added the \`${INPUT}\` free role to you.`);
					});
				}).catch(() => {
					call.message.channel.send(`Unable to add the \`${INPUT}\` free role to you.`).catch(() => {
						call.message.author.send(`Unable to add the \`${INPUT}\` free role to you.`);
					});
				});
			}
		} else {
			call.message.channel.send("Please specify a valid freerole option. Freeroles: `ANN, GW, QOTD, Movies`").catch(() => {
				call.message.author.send(`You atttempted to use the \`freerole\` command in ${call.message.channel}, but I do not have permissions to chat there.`);
			});
		}
	}
};
