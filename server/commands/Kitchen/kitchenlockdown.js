const isKitchenAdmin = require("@utility/kitchenAdmins");

module.exports = {
	id: "kitchenlockdown",
	description: "Locks down all kitchen commands",
	access: "Public",
	exec: (call) => {
		const { kitchen } = require("@server/load/orders.js");

		var kitchenServer = kitchen,
			member = kitchenServer.members.get(call.message.author.id);
		if (member && isKitchenAdmin(member)) {
			call.client.bbkLocked = !call.client.bbkLocked;
			if (!call.client.locked) call.client.bbkLockedChannels.length = 0;
			call.message.reply(`Bro Bot Kitchen is now ${(call.client.bbkLocked) ? "inaccessible" : "accessible"}.`);
		}
	}
};
