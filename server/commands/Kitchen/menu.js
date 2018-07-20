const { getMenu } = require("@utility/menu");

module.exports = {
	id: "menu",
	description: "Sends you the menu",
	access: "Public",
	exec: (call) => {
		if (!call.client.bbkLocked) {
			call.safeSend(null, call.message, { embed: getMenu(call.message.author) });
		} else {
			if (!call.client.bbkLockedChannels.includes(call.message.channel.id)) {
				call.client.bbkLockedChannels.push(call.message.channel.id);
				call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
			}
		}
	}
};
