var orders = require("../../load/orders.js").orders;

module.exports = {
	id: "cancelorder",
	description: "Cancels your current order",
	execute: (call) => {
		var filteredOrder = orders.find((o) => o.customer === call.message.author.tag);
		if (filteredOrder != null) {
			if (filteredOrder.status === "Awaiting Cook") {
				filteredOrder.msg.delete().then(() => {
					orders.splice(orders.indexOf(filteredOrder), 1);
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
	}
};
