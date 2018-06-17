module.exports = {
	id: "orders",
	description: "Lists unclaimed orders",
	execute: (call) => {
		var ordersChannel = call.client.channels.get("399290151932526593");
		ordersChannel.fetchMessages({ limit: 100 }).then((orders) => {
			var filteredOrders;
			if (call.params.readRaw() !== "" || call.params.readRaw() != null) {
				filteredOrders = orders.filter((m) => m.embeds[0] != null && m.embeds[0].fields[4].value.toLowerCase() === call.params.readRaw().toLowerCase());
			} else {
				filteredOrders = orders.filter((m) => m.embeds[0] != null);
			}
			if (call.params.readRaw().toLowerCase() === "claimed") {
				filteredOrders = orders.filter((m) => m.embeds[0] != null && m.embeds[0].fields[4].value.startsWith("Claimed"));
			}
			if (filteredOrders.first() != null) {
				var messageContent = filteredOrders.map((m) => `\`${m.embeds[0].fields[0].value}\``).join(",");
				call.message.reply(`Orders: ${messageContent}`);
			} else {
				call.message.reply("There are no orders with this status.").catch(() => {
					call.message.author.send(`You attempted to use the \`orders\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		});
	}
};
