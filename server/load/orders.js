module.exports = {
	id: "orders",
	orders: [],
	addOrder: function (order, tag) {
		this.orders.push({
			msg: order.msg,
			id: order.id,
			order: order.order,
			customer: order.customer,
			orderedFrom: order.orderedFrom,
			status: `Claimed (${tag})`,
			links: "None",
		});
	},
	delOrder: function (order) {
		this.orders.splice(this.orders.indexOf(order), 1);
	},
	exec: (client) => {
		var ordersChannel = client.channels.get("399290151932526593");
		if (ordersChannel != null) {
			ordersChannel.fetchMessages({ limit: 100 }).then((orders) => {
				orders = orders.filter((m) => m.embeds[0]).array();
				for (let order of orders) {
					module.exports.orders.push({
						msg: order,
						id: order.embeds[0].fields[0].value,
						order: order.embeds[0].fields[1].value,
						customer: order.embeds[0].fields[2].value,
						orderedFrom: order.embeds[0].fields[3].value,
						status: order.embeds[0].fields[4].value,
						links: order.embeds[0].fields[5].value || "None",
					});
				}
			});
		} else {
			console.warn("The client does not have access to the orders channel.");
			console.warn("All kitchen commands have been disabled on the client.");
			const COMMANDS = require("../chat/commands.js");
			COMMANDS.loaded = COMMANDS.loaded.filter((cmd) => cmd.category !== "Kitchen")
		}
	}
};
