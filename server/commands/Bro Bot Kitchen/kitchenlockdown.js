var isKitchenAdmin = require("app/kitchenAdmins");
module.exports = {
	id: "kitchenlockdown",
	description: "Locks down all kitchen commands",
	type: "kitchen",
	execute: (call) => {
		var kitchenServer = call.client.guilds.get("398948242790023168"),
			member = kitchenServer.members.get(call.message.author.id);
		if (member && isKitchenAdmin(member)) {
			call.client.bbkLocked = !call.client.bbkLocked;
			if (!call.client.locked) call.client.bbkLockedChannels.length = 0;
			call.message.reply(`Bro Bot Kitchen is now ${(call.client.bbkLocked) ? "inaccessible" : "accessible"}.`);
		}

	}
};
