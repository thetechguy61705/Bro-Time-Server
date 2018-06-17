var worker = require("app/workers");

module.exports = {
	id: "forcedelorder",
	description: "Deletes someone else's order",
	paramsHelp: "(order number) (reason)",
	execute: (call) => {
		var ordersChannel = call.client.channels.get("399290151932526593");
		var kitchenServer = ordersChannel.guild;
		var member = kitchenServer.members.get(call.message.author.id);
		if(member && worker(member)) {
			var code = call.params.readParameter();
			var reason = call.params.readParameter(true);
			if(code && reason) {
				ordersChannel.fetchMessages({ limit: 100 }).then((orders) => {
					var filteredOrder = orders.find((m) => m && m.embeds && m.embeds[0] && m.embeds[0].fields[0].value === code.toUpperCase());
					if (filteredOrder) {
						var userToMessage = call.client.users.find((m) => m.tag === filteredOrder.embeds[0].fields[2].value);
						filteredOrder.delete().then(() => {
							call.message.reply("Successfully cancelled this order").catch(() => {
								call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
							if(userToMessage) {
								userToMessage.send(`Your order has been cancelled. Reason: \`${reason}\``).catch(() => {
									call.message.reply("Couldn't DM this user, but I deleted the order anyways").catch(() => {
										call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
									});
								});
							} else {
								call.message.reply("Couldn't find the user to message, but I deleted the order anyways.");
							}
						}).catch(() => {
							call.message.reply("Couldn't cancel this order, please try again").catch(() => {
								call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						});
					} else {
						call.message.reply("Not a valid order ID!").catch(() => {
							call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				}).catch(() => {
					call.message.reply("Couldn't fetch current orders").catch(() => {
						call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				});
			} else {
				call.message.reply("You didn't supply the correct parameters! Usage: `!forcedelorder (order number) (reason)`").catch(() => {
					call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You don't have permission to use this command!").catch(() => {
				call.message.author.send(`You attempted to use the \`forcedelorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}

	}
};