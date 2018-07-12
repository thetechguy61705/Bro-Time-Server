const { delOrder, orders } = require("@server/load/orders.js");

module.exports = {
	id: "cancelorder",
	description: "Cancels your current order",
	access: "Public",
	execute: (call) => {
		if (!call.client.bbkLocked) {
			var filteredOrder = orders.find((o) => o.customer === call.message.author.tag);
			if (filteredOrder != null) {
				if (filteredOrder.status === "Awaiting Cook") {
					filteredOrder.msg.delete().then(() => {
						delOrder(filteredOrder);
						call.safeSend("Successfully cancelled your order");
					}).catch(() => {
						call.safeSend("Couldn't cancel your order, please try again");
					});
				} else call.safeSend("This order is already claimed, so you cannot cancel it!");
			} else call.safeSend("You do not have a current order! Order some food with `!order (item)`!");
		} else {
			if (!call.client.bbkLockedChannels.includes(call.message.channel.id)) {
				call.client.bbkLockedChannels.push(call.message.channel.id);
				call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
			}
		}
	}
};
