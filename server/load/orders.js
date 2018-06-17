module.exports = {
	id: "orders",
	orders: [],
	exec: (client) => {
		client.channels.find("id", "399290151932526593").fetchMessages({ limit: 100 }).then((orders) => {
			orders = orders.filter((m) => m.embeds[0]).array();
			for (let i= 0, len = orders.length; i < len; i++) {
				let order = orders[i];
				let id = order.embeds[0].fields[0].value;
				let orderedFood = order.embeds[0].fields[1].value;
				let customer = order.embeds[0].fields[2].value;
				let orderedFrom = order.embeds[0].fields[3].value;
				let status =  order.embeds[0].fields[4].value;
				module.exports.orders.push({ msg: order, id: id, order: orderedFood, customer: customer, orderedFrom: orderedFrom, status: status});
			}
		});
	}
};
