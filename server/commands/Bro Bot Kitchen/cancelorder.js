module.exports = {
	id: "cancelorder",
	description: "Cancels your current order",
	execute: (call) => {
		var ordersChannel = call.client.channels.get("399290151932526593");
		ordersChannel.fetchMessages({ limit: 100 }).then((orders) => {
			var filteredOrder = orders.find((m) => m && m.embeds && m.embeds[0] && m.embeds[0].fields[2].value === call.message.author.tag);
			if (filteredOrder) {
				if (!filteredOrder.embeds[0].fields[4].value.startsWith("Claimed")) {
					filteredOrder.delete().then(() => {
						call.message.reply("Successfully cancelled your order").catch(() => {
							call.message.author.send(`You attempted to use the \`cancelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}).catch(() => {
						call.message.reply("Couldn't cancel your order, please try again").catch(() => {
							call.message.author.send(`You attempted to use the \`cancelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					});
				} else {
					call.message.reply("This order is already claimed, so you cannot cancel it!").catch(() => {
						call.message.author.send(`You attempted to use the \`cancelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				call.message.reply("You do not have a current order! Order some food with `!order (item)`!").catch(() => {
					call.message.author.send(`You attempted to use the \`cancelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		}).catch(() => {
			call.message.reply("Couldn't fetch current orders").catch(() => {
				call.message.author.send(`You attempted to use the \`cancelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		});

	}
};