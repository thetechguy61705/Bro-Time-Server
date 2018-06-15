const COLOR_ROLES = ["Black", "White", "Red", "BrightRed", "Orange", "Bronze", "Gold", "HotBrown",
	"Salmon", "Yellow", "Green", "DarkGreen", "LimeGreen", "LightGreen", "Blue", "GrayBlue",
	"Cyan", "Purple", "Indigo", "DarkViolet", "Magenta", "HotPink", "Pink", "Invisible", "Multicolored"];

function removeColorRoles(roles, user) {
	for (var color of COLOR_ROLES) {
		if (user.roles.find("name", color))
			user.removeRole(roles.find("name", color));
	}
}

module.exports = {
	id: "namecolor",
	aliases: ["color"],
	description: "Gives the user the specified role if it is a part of !info namecolors list.",
	paramsHelp: "(color role)",
	requires: "Nothing/Bro Time Premium",
	execute: (call) => {
		const COLOR = call.params.readRaw().toLowerCase(),
			ROLE = call.params.readRole();
		if (COLOR_ROLES.map((r) => r.toLowerCase()).includes(COLOR)) {
			removeColorRoles(call.message.guild.roles, call.message.member);
			call.message.member.addRole(ROLE).then(() => {
				call.message.channel.send(`Successfully given you the \`${ROLE.name}\` color role!`).catch(() => {
					call.message.author.send(`Successfully given you the \`${ROLE.name}\` color role, note that I can not chat in ${call.message.channel}.`);
				});
			}).catch(() => {
				call.message.channel.send("There was an error while giving you the color role. Please try again.").catch(() => {
					call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`);
				});
			});
		} else {
			call.message.channel.send("Please specify a valid color role. A list of color roles can be found in `!info namecolors list`.").catch(() => {
				call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`);
			});
		}
	}
};
