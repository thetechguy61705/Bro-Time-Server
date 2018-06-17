var worker = require("app/workers");
const Discord = require("discord.js");
module.exports = {
	id: "claim",
	description: "Claims an order",
	paramsHelp: "(order id)",
	execute: (call) => {
		var code = call.params.readParameter();
		if(code) {
			var ordersChannel = call.client.channels.get("399290151932526593");
			var kitchenServer = ordersChannel.guild;
			var member = kitchenServer.members.get(call.message.author.id);
			if(member && worker(member)) {
				ordersChannel.fetchMessages({ limit: 100 }).then((orders) => {
					var filteredOrder = orders.find((m) => m && m.embeds && m.embeds[0] && m.embeds[0].fields[0].value === code.toUpperCase());
					if (filteredOrder) {
						if (!filteredOrder.embeds[0].fields[4].value.startsWith("Claimed")) {
							var orderEmbed = new Discord.RichEmbed()
								.setColor("RED")
								.addField("Order ID", filteredOrder.embeds[0].fields[0].value)
								.addField("Order", filteredOrder.embeds[0].fields[1].value)
								.addField("Customer", filteredOrder.embeds[0].fields[2].value)
								.addField("Ordered From", filteredOrder.embeds[0].fields[3].value)
								.addField("Status", `Claimed (${call.message.author.tag})`);
							filteredOrder.edit(orderEmbed).then(() => {
								call.message.reply("Successfully claimed this order.").catch(() => {
									call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
								});
								var userToMessage = call.client.users.find((m) => m.tag === filteredOrder.embeds[0].fields[2].value);
								if(userToMessage) {
									userToMessage.send("Your order has been claimed!").catch(() => {
										call.message.reply("Couldn't DM this user, but I claimed the order anyways").catch(() => {
											call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
										});
									});
								} else {
									call.message.reply("Couldn't find the user to message, but I claimed the order anyways.");
								}
							}).catch(() => {
								call.message.reply("Couldn't claim this order, please try again").catch(() => {
									call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
								});
							});
						} else {
							call.message.reply("This order is already claimed, so you cannot re-claim it!").catch(() => {
								call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					} else {
						call.message.reply("Not a valid order ID!").catch(() => {
							call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				}).catch(() => {
					call.message.reply("Couldn't fetch current orders").catch(() => {
						call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				});
			} else {
				call.message.reply("You do not have permission to use this command!").catch(() => {
					call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You did not supply the correct parameters! Usage: `!claim (order id)`").catch(() => {
				call.message.author.send(`You attempted to use the \`claim\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};