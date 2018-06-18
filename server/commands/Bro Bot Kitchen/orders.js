var orders = require("../../load/orders.js").orders;
var isWorker = require("app/workers");
module.exports = {
	id: "orders",
	description: "Lists unclaimed orders",
	paramsHelp: "[status]",
	type: "kitchen",
	execute: (call) => {
		var kitchenServer = call.client.guilds.get("398948242790023168"),
			member = kitchenServer.members.get(call.message.author.id);
		if(member != null && isWorker(member)) {
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
			} else {
				call.message.reply("There are no orders with this status.").catch(() => {
					call.message.author.send(`You attempted to use the \`orders\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You don't have permission to use this command!").catch(() => {
				call.message.author.send(`You attempted to use the \`orders\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
