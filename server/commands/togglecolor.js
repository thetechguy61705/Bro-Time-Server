module.exports = {
	multicolor: true,
	id: "togglecolor",
	description: "Toggles the multicolored role from switching colors",
	requires: "Permission: MANAGE ROLES",
	load: () => {},
	execute: (call) => {
		require(".togglecolor").multicolor
		if (call.message.member.hasPermission("MANAGE_ROLES")) {
			if (require(".togglecolor").multicolor) {
				require(".togglecolor").multicolor = false;
			} else {
				require(".togglecolor").multicolor = true;
			}
			call.message.channel.send(`Toggled the multicolor role to \`${require(".togglecolor").multicolor}\`.`);
		}
	}
};
