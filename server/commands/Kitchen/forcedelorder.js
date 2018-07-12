const isWorker = require("@utility/workers");
const { delOrder, orders, kitchen } = require("@server/load/orders.js");
const { RichEmbed } = require("discord.js");

module.exports = {
	id: "forcedelorder",
	description: "Deletes someone else's order",
	paramsHelp: "(order number) (reason)",
	access: "Public",
	execute: (call) => {
		if (!call.client.bbkLocked) {
			var kitchenServer = kitchen,
				member = kitchenServer.members.get(call.message.author.id);
			if (member != null && isWorker(member)) {
				var code = call.params.readParam(),
					reason = call.params.readParam(true);
				if (code != null && reason != null) {
					var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
					if (filteredOrder != null) {
						var userToMessage = call.client.users.find((m) => m.tag === filteredOrder.customer);
						filteredOrder.msg.delete().then(() => {
							var logsChannel = kitchenServer.channels.get("458288216609652736");
							var orderEmbed = new RichEmbed()
								.setColor("RED")
								.addField("Order ID", filteredOrder.id)
								.addField("Order", filteredOrder.order)
								.addField("Customer", filteredOrder.customer)
								.addField("Ordered From", filteredOrder.orderedFrom)
								.addField("Status", `Cancelled by ${call.message.author.tag} for ${reason}`)
								.addField("Links", filteredOrder.links);
							logsChannel.send({ embed: orderEmbed }).catch(() => {});
							delOrder(filteredOrder);
							call.message.reply("Successfully cancelled this order.").catch(() => {
								call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
							if (userToMessage != null) {
								userToMessage.send(`Your order has been cancelled. Reason: \`${reason}\``).catch(() => {
									call.safeSend("Couldn't DM this user, but I deleted the order anyways");
								});
							} else {
								call.message.reply("Couldn't find the user to message, but I deleted the order anyways.");
							}
						}).catch(() => {
							call.safeSend("Couldn't cancel this order, please try again");
						});
					} else call.safeSend("Not a valid order ID!");
				} else call.safeSend("You didn't supply the correct parameters! Usage: `!forcedelorder (order number) (reason)`");
			} else call.safeSend("You don't have permission to use this command!");
		} else {
			if (!call.client.bbkLockedChannels.includes(call.message.channel.id)) {
				call.client.bbkLockedChannels.push(call.message.channel.id);
				call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
			}
		}
	}
};
