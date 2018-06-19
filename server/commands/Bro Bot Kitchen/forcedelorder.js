var isWorker = require("app/workers");
var orders = require("../../load/orders.js").orders;
module.exports = {
	id: "forcedelorder",
	description: "Deletes someone else's order",
	paramsHelp: "(order number) (reason)",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		} else if (call.client.bbkLocked) {
			return;
		}
		var kitchenServer = call.client.guilds.get("398948242790023168"),
			member = kitchenServer.members.get(call.message.author.id);
		if(member != null && isWorker(member)) {
			var code = call.params.readParameter(),
				reason = call.params.readParameter(true);
			if (code != null && reason != null) {
				var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
				if (filteredOrder != null) {
					var userToMessage = call.client.users.find((m) => m.tag === filteredOrder.customer);
					filteredOrder.msg.delete().then(() => {
						orders.splice(orders.indexOf(filteredOrder), 1);
						call.message.reply("Successfully cancelled this order.").catch(() => {});
						if (userToMessage != null) {
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
