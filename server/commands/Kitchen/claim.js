const { RichEmbed } = require("discord.js");
const isWorker = require("@utility/workers");

module.exports = {
	id: "claim",
	description: "Claims an order",
	paramsHelp: "(order id)",
	access: "Public",
	exec: (call) => {
		const { addOrder, delOrder, orders, kitchen } = require("@server/load/orders.js");

		if (!call.client.bbkLocked) {
			var code = call.params.readParam();
			if (code != null) {
				var kitchenServer = kitchen,
					member = kitchenServer.members.get(call.message.author.id);
				if (member != null && isWorker(member)) {
					var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
					if (filteredOrder != null) {
						if (!filteredOrder.status.startsWith("Claimed")) {
							var orderEmbed = new RichEmbed()
								.setColor("RED")
								.addField("Order ID", filteredOrder.id)
								.addField("Order", filteredOrder.order)
								.addField("Customer", filteredOrder.customer)
								.addField("Ordered From", filteredOrder.orderedFrom)
								.addField("Status", `Claimed (${call.message.author.tag})`)
								.addField("Links", "None");
							filteredOrder.msg.edit(orderEmbed).then(() => {
								addOrder(filteredOrder.msg, filteredOrder.id, filteredOrder.order, filteredOrder.customer, filteredOrder.orderedFrom, `Claimed (${call.message.author.tag})`, "None");
								delOrder(filteredOrder);
								call.message.reply("Successfully claimed this order.").catch(() => {});
								call.message.author.send("Your claimed order:", { embed: orderEmbed }).catch(() => {});
								var userToMessage = call.client.users.find((m) => m.tag === filteredOrder.customer);
								if (userToMessage != null) {
									userToMessage.send("Your order has been claimed!").catch(() => {
										call.safeSend("Couldn't DM this user, but I claimed the order anyways");
									});
								} else {
									call.message.reply("Couldn't find the user to message, but I claimed the order anyways.");
								}
							}).catch((exc) => {
								console.warn(exc.stack);
								call.safeSend("Couldn't claim this order, please try again");
							});
						} else call.safeSend("This order is already claimed, so you cannot re-claim it!");
					} else call.safeSend("Not a valid order ID!");
				} else call.safeSend("You do not have permission to use this command!");
			} else call.safeSend("You did not supply the correct parameters! Usage: `!claim (order id)`");
		} else {
			if (!call.client.bbkLockedChannels.includes(call.message.channel.id)) {
				call.client.bbkLockedChannels.push(call.message.channel.id);
				call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
			}
		}
	}
};
