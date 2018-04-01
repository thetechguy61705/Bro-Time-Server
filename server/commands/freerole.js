var joinableroles = ["QOTD", "ANN", "GW"];

module.exports = {
	id: "freerole",
	load: () => {},
	execute: (call) => {
		var finput = call.params.readRaw().trim();
		if (joinableroles.includes(finput.toUpperCase())) {
			var role = call.message.guild.roles.find("name", finput.toUpperCase());
			if (call.message.member.roles.has(role.id)) {
				call.message.member.removeRole(role).then(() => {
					call.message.channel.send(`Successfully removed the \`${finput}\` free role from you.`).catch(() => {
						call.message.author.send(`Successfully removed the \`${finput}\` free role from you.`).catch();
					});
				}).catch(() => {
					call.message.channel.send(`Unable to remove the \`${finput}\` free role from you.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${finput}\` free role from you.`).catch();
					});
				});
			} else {
				call.message.member.addRole(role).then(() => {
					call.message.channel.send(`Successfully added the \`${finput}\` free role to you.`).catch(() => {
						call.message.author.send(`Successfully added the \`${finput}\` free role to you.`).catch();
					});
				}).catch(() => {
					call.message.channel.send(`Unable to add the \`${finput}\` free role to you.`).catch(() => {
						call.message.author.send(`Unable to add the \`${finput}\` free role to you.`).catch();
					});
				});
			}
		} else {
			call.message.channel.send(`\`${finput} \` is not a valid freerole option`).catch(() => {
				call.message.author.send(`You atttempted to use the \`freerole\` command in ${call.message.channel}, but I do not have permissions to chat there.`)
				.catch();
			});
		}
	}
};
