const isWorker = require("@utility/workers");

module.exports = {
	id: "orders",
	description: "Lists unclaimed orders",
	paramsHelp: "[status]",
	access: "Public",
	exec: (call) => {
		const { orders, kitchen } = require("@server/load/orders.js");

		if (!call.client.bbkLocked) {
			var kitchenServer = kitchen,
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
					var messageContent = filteredOrders.map((m) => "`" + m.id + "`").join(",");
					call.message.reply(`Orders: ${messageContent}`);
				} else call.safeSend("There are no orders with this status.");
			} else call.safeSend("You don't have permission to use this command!");
		} else {
			if (!call.client.bbkLockedChannels.includes(call.message.channel.id)) {
				call.client.bbkLockedChannels.push(call.message.channel.id);
				call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
			}
		}
	}
};
