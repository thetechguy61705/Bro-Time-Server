const { Collection } = require("discord.js");

function changeKitchenCommands(remove) {
	var commands = require("@server/chat/commands.ts").loaded;
	if (remove) {
		var count = commands.sweep((cmd) => cmd.category === "Kitchen");
		console.warn("The client does not have or lost access to the orders channel.");
		if (count > 0) console.warn("All kitchen commands have been disabled on the client.");
	} else {
		for (let cmd of module.exports.storedCommands.array())
			commands.set(cmd.id, cmd);
		console.warn("The client has been given access to the orders channel. Kitchen commands have been loaded into the client.");
	}
}

async function hasOrders(client) {
	var containsOrders = await client.shard.broadcastEval("this.channels" +
		".filter((channel) => channel.permissionsFor(channel.guild.me).has(['VIEW_CHANNEL', 'SEND_MESSAGES'])).keyArray();");
	containsOrders = containsOrders.find((channels) => channels.includes("399290151932526593"));
	return containsOrders;
}

module.exports = {
	id: "orders",
	orders: [],
	storedCommands: new Collection(),
	kitchen: null,
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
		module.exports.orders.splice(module.exports.orders.indexOf(order), 1);
	},
	exec: async function (client) {
		client.on("guildDelete", async (guild) => {
			let orders = await hasOrders(guild.client);
			if (orders) changeKitchenCommands(true);
		});

		client.on("guildCreate", async (guild) => {
			let orders = await hasOrders(guild.client);
			if (orders)
				changeKitchenCommands(false);
		});

		client.on("guildMemberUpdate", (_, member) => {
			var channel = member.guild.channels.get("399290151932526593");
			if (member.id === member.guild.me.id && channel) {
				if (channel.permissionsFor(member).has(["SEND_MESSAGES", "VIEW_CHANNEL"])) {
					changeKitchenCommands(false);
				} else changeKitchenCommands(true);
			}
		});

		let orders = await hasOrders(client);
		if (orders) {
			client.shard.broadcastEval(
				"var ordersChannel = this.channels.get('399290151932526593');" +
				"if (ordersChannel != null) {" +
					"var orderModule = require('@server/load/orders.js');" +
					"ordersChannel.fetchMessages({ limit: 100 }).then(async (orders) => {" +
						"orders = orders.filter((m) => m.embeds[0]).array();" +
						"for (let order of orders) {" +
							"orderModule.orders.push({" +
								"msg: order," +
								"id: order.embeds[0].fields[0].value," +
								"order: order.embeds[0].fields[1].value," +
								"customer: order.embeds[0].fields[2].value," +
								"orderedFrom: order.embeds[0].fields[3].value," +
								"status: order.embeds[0].fields[4].value,"  +
								"links: order.embeds[0].fields[5].value || 'None'," +
							"});" +
						"}" +
						"orderModule.kitchen = await ordersChannel.guild.fetchMembers();" +
					"});" +
				"}"
			);
		} else changeKitchenCommands(true);
	}
};
