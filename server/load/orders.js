module.exports = {
	id: "orders",
	orders: [],
	exec: (client) => {
		client.channels.find("id", "399290151932526593").fetchMessages({ limit: 100 }).then((orders) => {
			orders = orders.filter((m) => m.embeds[0]).array();
			for (let i= 0, len = orders.length; i < len; i++) {
				let order = orders[i];
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
	}
};
