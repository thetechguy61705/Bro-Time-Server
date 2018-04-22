module.exports = {
	id: "togglecolor",
	load: () => {},
	execute: (call) => {
		if (call.message.member.hasPermission("MANAGE_ROLES")) {
			if (call.client.multicolor) {
				this.multicolor = false;
			} else {
				this.multicolor = true;
			}
			call.message.channel.send(`Toggled the multicolor role to \`${this.multicolor}\`.`);
		}
	}
};
