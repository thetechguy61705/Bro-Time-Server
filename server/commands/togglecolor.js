module.exports = {
	id: "togglecolor",
	load: () => {},
	execute: (call) => {
		if (call.message.member.hasPermission("MANAGE_ROLES")) {
			var toggle;
			if (call.client.multicolor) {
				call.client.multicolor = false;
				toggle = "off";
			} else {
				call.client.multicolor = true;
				toggle = "on";
			}
			call.message.channel.send(`Toggled the multicolor role to \`${toggle}\`.`).catch(() => {
				call.message.author.send(`You attempted to run the \`togglecolor\` command in ${call.message.channel}, but I do not have permission to chat there.\nSwitched ${ha}.`)
					.catch(function(){});
			});
		}
	}
};
