module.exports = {
	multicolor: false,
	id: "togglecolor",
	description: "Toggles the multicolored role from switching colors",
	requires: "Permission: MANAGE ROLES",
	load: () => {},
	execute: (call) => {
		if (call.message.member.hasPermission("MANAGE_ROLES")) {
			if (this.multicolor) {
				this.multicolor = false;
			} else {
				this.multicolor = true;
			}
			call.message.channel.send(`Toggled the multicolor role to \`${this.multicolor}\`.`);
		}
	}
};
