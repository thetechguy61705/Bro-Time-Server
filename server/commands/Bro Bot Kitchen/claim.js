const Discord = require("discord.js");
var isWorker = require("app/workers");
var orders = require("../../load/orders.js").orders;
module.exports = {
	id: "claim",
	description: "Claims an order",
	paramsHelp: "(order id)",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		} else if (call.client.bbkLocked) {
			return;
		}
		var code = call.params.readParameter();
		if (code != null) {
			var kitchenServer = call.client.guilds.get("398948242790023168"),
				member = kitchenServer.members.get(call.message.author.id);
			if(member != null && isWorker(member)) {
				var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
				if (filteredOrder != null) {

					if (!filteredOrder.status.startsWith("Claimed")) {
						var orderEmbed = new Discord.RichEmbed()
							.setColor("RED")
							.addField("Order ID", filteredOrder.id)
							.addField("Order", filteredOrder.order)
							.addField("Customer", filteredOrder.customer)
							.addField("Ordered From", filteredOrder.orderedFrom)
							.addField("Status", `Claimed (${call.message.author.tag})`)
							.addField("Links", "None");
						filteredOrder.msg.edit({ embed: orderEmbed }).then(() => {
							orders.push({
								msg: filteredOrder.msg,
								id: filteredOrder.id,
								order: filteredOrder.order,
								customer: filteredOrder.customer,
								orderedFrom: filteredOrder.orderedFrom,
								status: `Claimed (${call.message.author.tag})`,
								links: "None",
							});
							orders.splice(orders.indexOf(filteredOrder), 1);
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
						}).catch(() => {
							call.safeSend("Couldn't claim this order, please try again");
						});
					} else call.safeSend("This order is already claimed, so you cannot re-claim it!");
				} else call.safeSend("Not a valid order ID!");
			} else call.safeSend("You do not have permission to use this command!");
		} else call.safeSend("You did not supply the correct parameters! Usage: `!claim (order id)`");
	}
};
