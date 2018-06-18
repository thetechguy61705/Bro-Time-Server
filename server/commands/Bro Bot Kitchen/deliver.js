var isWorker = require("app/workers");
var orders = require("../../load/orders.js").orders;
module.exports = {
	id: "deliver",
	description: "Delivers food to customer",
	paramsHelp: "(order id)",
	type: "kitchen",
	execute: (call) => {
		var code = call.params.readParameter();
		if (code != null) {
			var kitchenServer = call.client.guilds.get("398948242790023168"),
				member = kitchenServer.members.get(call.message.author.id);
			if(member != null && isWorker(member)) {
				var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
				if (filteredOrder != null) {
					if (filteredOrder.status.startsWith("Cooked")) {
						if (filteredOrder.status.includes(call.message.author.tag)) {
							var usertoSend = call.client.users.find((m) => m.tag === filteredOrder.customer);
							if (usertoSend != null) {
								usertoSend.send(`Your food was delivered by ${call.message.author.tag}:\n${filteredOrder.links}`).then(() => {
									filteredOrder.msg.delete().catch(() => {
										call.message.author.send("I couldn't delete this order from the #kitchen channel, please manually delete it before the next bot restart!").catch(() => {
											call.message.author.send(`You attempted to use the \`deliver\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
										});
									});
									orders.splice(orders.indexOf(filteredOrder), 1);
									call.message.reply("Successfully delivered this order.").catch(() => {
										call.message.author.send(`You attempted to use the \`deliver\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
									});
								}).catch(() => {
									call.message.reply("Couldn't DM this user, please try again").catch(() => {
										call.message.author.send(`You attempted to use the \`deliver\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
									});
								});
							} else {
								call.message.reply("Couldn't find the user to message, but I delivered the order anyways.");
							}
						} else {
							call.message.reply("You can only deliver orders that you have claimed!").catch(() => {
								call.message.author.send(`You attempted to use the \`deliver\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					} else {
						call.message.reply("You did not cook all of the food yet! Please try again once you have finished making the food.").catch(() => {
							call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.message.reply("Not a valid order ID!").catch(() => {
						call.message.author.send(`You attempted to use the \`deliver\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				call.message.reply("You do not have permission to use this command!").catch(() => {
					call.message.author.send(`You attempted to use the \`deliver\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You did not supply the correct parameters! Usage: `!deliver (order id)`").catch(() => {
				call.message.author.send(`You attempted to use the \`deliver\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
