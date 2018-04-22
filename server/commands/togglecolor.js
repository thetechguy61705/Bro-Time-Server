module.exports = {
	multicolor: true,
	id: "togglecolor",
	description: "Toggles the multicolored role from switching colors",
	requires: "Permission: MANAGE ROLES",
	load: () => {},
	execute: (call) => {
		var multicolor = require("./togglecolor").multicolor
		if (call.message.member.hasPermission("MANAGE_ROLES")) {
			if (multicolor) {
				multicolor = false;
			} else {
				multicolor = true;
			}
			call.message.channel.send(`Toggled the multicolor role to \`${multicolor}\`.`);
		}
	}
};
