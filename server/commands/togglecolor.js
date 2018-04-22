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
			call.message.channel.send(`Toggled the multicolor role to \`${this.multicolor}\`.`).catch(() => {
				call.message.author.send(`You attempted to run the \`togglecolor\` command in ${call.message.channel}, but I do not have permission to chat there.\nToggled the multicolor role to \`${this.multicolor}\`.`)
					.catch(function(){});
			});
		}
	}
};
