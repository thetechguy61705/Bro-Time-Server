module.exports = {
	id: "orders",
	orders: [],
	exec: (client) => {
		client.channels.find("id", "399290151932526593").fetchMessages({ limit: 100 }).then((orders) => {
			orders = orders.filter((m) => m.embeds[0]);
			for (let i= 0, len = orders.length; i < len; i++) {
				const order = orders[i];
				const id = order.embeds[0].fields[0].value;
				const orderedFood = order.embeds[0].fields[1].value;
				const customer = order.embeds[0].fields[2].value;
				const orderedFrom = order.embeds[0].fields[3].value;
				const status =  order.embeds[0].fields[4].value;
				require("./orders.js").orders.push({ msg: order, id: id, order: orderedFood, customer: customer, orderedFrom: orderedFrom, status: status});
			}
		});
	}
};
