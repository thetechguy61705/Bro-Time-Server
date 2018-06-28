const { orders } = require("../../load/orders.js");
const isWorker = require("app/workers");

module.exports = {
	id: "orders",
	description: "Lists unclaimed orders",
	paramsHelp: "[status]",
	access: "Public",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		} else if (call.client.bbkLocked) {
			return;
		}
		var kitchenServer = call.client.guilds.get("398948242790023168"),
			member = kitchenServer.members.get(call.message.author.id);
		if (member != null && isWorker(member)) {
			var ordersToFilter = orders;
			var filteredOrders;
			if (call.params.readRaw()) {
				filteredOrders = ordersToFilter.filter((m) => m.status.toLowerCase().startsWith(call.params.readRaw().toLowerCase()));
			} else {
				filteredOrders = ordersToFilter;
			}
			if (call.params.readRaw().toLowerCase() === "claimed") {
				filteredOrders = ordersToFilter.filter((m) => m.status.startsWith("Claimed"));
			}
			if (filteredOrders[0] != null) {
				var messageContent = filteredOrders.map((m) => `\`${m.id}\``).join(",");
				call.message.reply(`Orders: ${messageContent}`);
			} else call.safeSend("There are no orders with this status.");
		} else call.safeSend("You don't have permission to use this command!");
	}
};
