const allroles = ["Black", "White", "Red", "BrightRed", "Orange", "Bronze", "Gold", "HotBrown",
	"Salmon", "Yellow", "Green", "DarkGreen", "LimeGreen", "LightGreen", "Blue", "GrayBlue",
	"Cyan", "Purple", "Indigo", "DarkViolet", "Magenta", "HotPink", "Pink", "Multicolored"];

function removeColorRoles(roles, user) {
	allroles.forEach((color) => {
		if (user.roles.find("name", color)) {
			user.removeRole(roles.find("name", color)).catch(function() {});
		}
	});
}

module.exports = {
	id: "namecolor",
	aliases: ["color"],
	description: "Gives the user the specified role if it is a part of !info namecolors list.",
	arguments: "(color role)",
	requires: "Nothing/Bro Time Premium",
	execute: (call) => {
		let color = call.params.readRaw().toLowerCase();
		let role = call.params.readRole();
		if (allroles.map(r => r.toLowerCase()).includes(color)) {
			if (allroles.includes(color)) {
				removeColorRoles(call.message.guild.roles, call.message.member);
				call.message.member.addRole(role).then(() => {
					call.message.channel.send(`Successfully given you the \`${role.name}\` color role!`).catch(() => {
						call.message.author.send(`Successfully given you the \`${role.name}\` color role, note that I can not chat in ${call.message.channel}.`)
							.catch(function() {});
					});
				}).catch(() => {
					call.message.channel.send("There was an error while giving you the color role. Please try again.").catch(() => {
						call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
							.catch(function() {});
					});
				});
			}
		} else {
			call.message.channel.send("Please specify a valid color role. A list of color roles can be found in `!info namecolors list`.").catch(() => {
				call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
					.catch(function() {});
			});
		}
	}
};
