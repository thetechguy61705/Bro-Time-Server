const joinableroles = ["QOTD", "ANN", "GW"];

module.exports = {
	id: "freerole",
	description: "Gives the user the specified role if it is QOTD, ANN or GW.",
	arguments: "(ANN/GW/QoTD)",
	execute: (call) => {
		var finput = call.params.readRaw().trim();
		if (joinableroles.includes(finput.toUpperCase())) {
			var role = call.message.guild.roles.find("name", finput.toUpperCase());
			if (call.message.member.roles.has(role.id)) {
				call.message.member.removeRole(role).then(() => {
					call.message.channel.send(`Successfully removed the \`${finput}\` free role from you.`).catch(() => {
						call.message.author.send(`Successfully removed the \`${finput}\` free role from you.`).catch(function(){});
					});
				}).catch(() => {
					call.message.channel.send(`Unable to remove the \`${finput}\` free role from you.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${finput}\` free role from you.`).catch(function(){});
					});
				});
			} else {
				call.message.member.addRole(role).then(() => {
					call.message.channel.send(`Successfully added the \`${finput}\` free role to you.`).catch(() => {
						call.message.author.send(`Successfully added the \`${finput}\` free role to you.`).catch(function(){});
					});
				}).catch(() => {
					call.message.channel.send(`Unable to add the \`${finput}\` free role to you.`).catch(() => {
						call.message.author.send(`Unable to add the \`${finput}\` free role to you.`).catch(function(){});
					});
				});
			}
		} else {
			call.message.channel.send("Please specify a valid freerole option. Freeroles: `ANN, GW, QOTD`").catch(() => {
				call.message.author.send(`You atttempted to use the \`freerole\` command in ${call.message.channel}, but I do not have permissions to chat there.`)
					.catch(function(){});
			});
		}
	}
};
