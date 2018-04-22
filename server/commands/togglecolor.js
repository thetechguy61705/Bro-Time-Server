module.exports = {
	multicolor: true,
	id: "togglecolor",
	load: () => {},
	execute: (call) => {
		if (call.message.member.hasPermission("MANAGE_ROLES")) {
			if (this.module.exports.multicolor) {
				this.module.exports.multicolor = false;
			} else {
				this.module.exports.multicolor = true;
			}
			call.message.channel.send(`Toggled the multicolor role to \`${this.module.exports.multicolor}\`.`);
		}
	}
};
