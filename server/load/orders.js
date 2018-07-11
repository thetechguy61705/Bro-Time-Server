module.exports = {
	id: "orders",
	orders: [],
	addOrder: function (msg, id, order, customer, orderedFrom, status, links) {
		module.exports.orders.push({
			msg: msg,
			id: id,
			order: order,
			customer: customer,
			orderedFrom: orderedFrom,
			status: status,
			links: links,
		});
	},
	delOrder: function (order) {
		this.orders.splice(this.orders.indexOf(order), 1);
	},
	exec: function (client) {
		client.shard.broadcastEval(
			"var ordersChannel = this.channels.get('399290151932526593');" +
			"var kitchenGuild = this.guilds.get('398948242790023168');" +
			"if (ordersChannel != null && kitchenGuild != null) {" +
				"ordersChannel.fetchMessages({ limit: 100 }).then((orders) => {" +
					"orders = orders.filter((m) => m[0]);" +
					"var arr = [];" +
					"for (let order of orders) {" +
						"arr.push({" +
							"msg: order," +
							"id: order.embeds[0].fields[0].value," +
							"order: order.embeds[0].fields[1].value," +
							"customer: order.embeds[0].fields[2].value," +
							"orderedFrom: order.embeds[0].fields[3].value," +
							"status: order.embeds[0].fields[4].value," +
							"links: order.embeds[0].fields[5].value || 'None'," +
						"});" +
					"}" +
					"return arr;" +
				"});" +
			"}"
		).then((results) => {
			var trueResult = results.find((result) => result != null);
			if (trueResult != null) {
				for (let order of trueResult) {
					this.orders.push(order);
				}
			} else {
				console.log("The client does not have access to the orders channel.");
				console.log("All kitchen commands have been disabled on the client.");
				const COMMANDS = require("../chat/commands.js");
				COMMANDS.loaded = COMMANDS.loaded.filter((cmd) => cmd.category !== "Kitchen");
			}
		});
	}
};
