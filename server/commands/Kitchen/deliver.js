const isWorker = require("app/workers");
const { delOrder, orders } = require("../../load/orders.js");
const { RichEmbed } = require("discord.js");

module.exports = {
	id: "deliver",
	description: "Delivers food to customer",
	paramsHelp: "(order id)",
	access: "Public",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		} else if (call.client.bbkLocked) {
			return;
		}
		if (!call.client.bbkLocked) {
			var code = call.params.readParam();
			if (code != null) {
				var kitchenServer = call.client.guilds.get("398948242790023168"),
					member = kitchenServer.members.get(call.message.author.id);
				if (member != null && isWorker(member)) {
					var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
					if (filteredOrder != null) {
						if (filteredOrder.status.startsWith("Cooked")) {
							if (filteredOrder.status.includes(call.message.author.tag)) {
								var logsChannel = call.client.channels.get("458288216609652736");
								var usertoSend = call.client.users.find((m) => m.tag === filteredOrder.customer);
								if (usertoSend != null) {
									usertoSend.send(`Your food was delivered by ${call.message.author.tag}:\n${filteredOrder.links}`).then(() => {
										var orderEmbed = new RichEmbed()
											.setColor("RED")
											.addField("Order ID", filteredOrder.id)
											.addField("Order", filteredOrder.order)
											.addField("Customer", filteredOrder.customer)
											.addField("Ordered From", filteredOrder.orderedFrom)
											.addField("Status", `Delivered (${call.message.author.tag})`)
											.addField("Links", filteredOrder.links);
										logsChannel.send({ embed: orderEmbed }).catch(() => {});
										filteredOrder.msg.delete().catch(() => {
											call.message.author.send("I couldn't delete this order from the #kitchen channel, please manually delete it before the next bot restart!");
										});
										delOrder(filteredOrder);
										call.safeSend("Successfully delivered this order.");
									}).catch(() => {
										call.safeSend("Couldn't DM this user, please try again");
									});
								} else call.message.reply("Couldn't find the user to message, but I delivered the order anyways.");
							} else call.safeSend("You can only deliver orders that you have claimed!");
						} else call.safeSend("You did not cook all of the food yet! Please try again once you have finished making the food.");
					} else call.safeSend("Not a valid order ID!");
				} else call.safeSend("You do not have permission to use this command!");
			} else call.safeSend("You did not supply the correct parameters! Usage: `!deliver (order id)`");
		} else {
			if (!call.client.bbkLockedChannels.includes(call.message.channel.id)) {
				call.client.bbkLockedChannels.push(call.message.channel.id);
				call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
			}
		}
	}
};
