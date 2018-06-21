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
		const ROLE = call.params.readRole();
		if (ROLE != null && COLOR_ROLES.includes(ROLE.name)) {
			removeColorRoles(call.message.guild.roles, call.message.member);
			call.message.member.addRole(ROLE).then(() => {
				call.message.reply(`Successfully given you the \`${ROLE.name}\` color role!`).catch(() => {
					call.message.author.send(`Successfully given you the \`${ROLE.name}\` color role, note that I can not chat in ${call.message.channel}.`);
				});
			}).catch(() => {
				call.safeSend("There was an error while giving you the color role. Please try again.");
			});
		} else call.safeSend("Please specify a valid color role. Color role options can be found in `!info namecolors list`.");
	}
};
