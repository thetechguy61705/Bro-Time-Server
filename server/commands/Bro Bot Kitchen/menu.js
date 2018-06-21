var { getMenu } = require("app/menu");
module.exports = {
	id: "menu",
	description: "Sends you the menu",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		} else if (call.client.bbkLocked) {
			return;
		}
		call.safeSend({ embed: getMenu(call.message.author) }, call.message, false);
	}
};
