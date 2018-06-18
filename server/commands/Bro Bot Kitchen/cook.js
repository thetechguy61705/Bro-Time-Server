var isWorker = require("app/workers");
const Discord = require("discord.js");
var orders = require("../../load/orders.js").orders;
function titleCase(str) {
	var newString = "";
	for (let i = 0; i < str.length; i++) {
		newString += (i === 0 || str.charAt(i - 1) === " ") ? str.charAt(i).toUpperCase() : str.charAt(i).toLowerCase();
	}
	return newString;
}
module.exports = {
	id: "cook",
	description: "Cooks someone's order",
	paramsHelp: "(order number) | (food/drink) | (link)",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		}
		var kitchenServer = call.client.guilds.get("398948242790023168"),
			member = kitchenServer.members.get(call.message.author.id);
		if(member != null && isWorker(member)) {
			if (call.message.content.split("|")[1] && call.message.content.split("|")[2]) {
				var code = call.params.readParameter().trim();
				var food = titleCase(call.message.content.split("|")[1].trim());
				var link = call.message.content.split("|")[2].trim().toLowerCase();
				if (code != null && food != null && link != null) {
					var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
					if (filteredOrder != null) {
						if(filteredOrder.status !== "Awaiting Cook") {
							if(filteredOrder.status.includes(call.message.author.tag)) {
								var foods = filteredOrder.order.replace(/`/gi, "").split("\n").map((m) => m.toLowerCase()).filter((m) => !filteredOrder.links.toLowerCase().includes(m.toLowerCase()));
								if(foods.includes(food.toLowerCase())) {
									var links;
									if(filteredOrder.links !== "None") {
										links = filteredOrder.links + `\n${food} - ${link}`;
									} else {
										links = `${food} - ${link}`;
									}
									var status = "Cooking";
									var justFoods = filteredOrder.order.split("\n");
									var justLinks = filteredOrder.links.split("\n");
									if (justFoods.length <= justLinks.length + 1) {
										status = "Cooked";
									}
									var orderEmbed = new Discord.RichEmbed()
										.setColor("RED")
										.addField("Order ID", filteredOrder.id)
										.addField("Order", filteredOrder.order)
										.addField("Customer", filteredOrder.customer)
										.addField("Ordered From", filteredOrder.orderedFrom)
										.addField("Status", `${status} (${call.message.author.tag})`)
										.addField("Links", links);
									filteredOrder.msg.edit({ embed: orderEmbed }).then(() => {
										orders.push({
											msg: filteredOrder.msg,
											id: filteredOrder.id,
											order: filteredOrder.order,
											customer: filteredOrder.customer,
											orderedFrom: filteredOrder.orderedFrom,
											status: `${status} (${call.message.author.tag})`,
											links: links,
										});
										orders.splice(orders.indexOf(filteredOrder), 1);
										call.message.reply("Successfully cooked this item.").catch(() => {});
									}).catch(() => {
										call.message.reply("Couldn't cook this food, please try again").catch(() => {
											call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
										});
									});
								} else {
									call.message.reply("Not a valid food/drink to cook, or was already cooked").catch(() => {
										call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
									});
								}
							} else {
								call.message.reply("You can only cook orders claimed by you!").catch(() => {
									call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
								});
							}
						} else {
							call.message.reply("You must claim orders before you can cook them!").catch(() => {
								call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					} else {
						call.message.reply("Not a valid order ID!").catch(() => {
							call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.message.reply("You didn't supply the correct parameters! Usage: `!cook (order number) | (food/drink) | (link)`").catch(() => {
						call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				call.message.reply("You didn't supply the correct parameters! Usage: `!cook (order number) | (food/drink) | (link)`").catch(() => {
					call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You don't have permission to use this command!").catch(() => {
				call.message.author.send(`You attempted to use the \`cook\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}

	}
};
