var { MENU } = require("app/menu");
var random = require("random-letters");
const { RichEmbed } = require("discord.js");

function titleCase(str) {
	var newString = "";
	for (let i = 0; i < str.length; i++) {
		newString += (i === 0 || str.charAt(i - 1) === " ") ? str.charAt(i).toUpperCase() : str.charAt(i).toLowerCase();
	}
	return newString;
}
var orders = require("../../load/orders.js").orders;
module.exports = {
	id: "order",
	description: "Orders food",
	paramsHelp: "(item), [item2], [item3]",
	execute: (call) => {
		var filteredOrder = orders.find((o) => o.customer === call.message.author.tag);
		if (!filteredOrder) {
			var foods = call.params.readRaw().split(",").map((val) => val.trim());
			if(foods[0] !== "") {
				if(foods.length < 4) {
					var noMenu = [];
					for (let food of foods) {
						if(!MENU.find((item) => item.toLowerCase() === food.toLowerCase())) {
							noMenu.push(food.toLowerCase());
						}
					}
					if (noMenu.length === 0) {
						var id = random(3).toUpperCase(),
							ordersChannel = call.client.channels.get("399290151932526593"),
							orderedFromString = `${call.message.channel.toString()} (${call.message.channel.id}) in ${call.message.channel.guild.name} (${call.message.channel.guild.id})`;
						var orderEmbed = new RichEmbed()
							.setColor("RED")
							.addField("Order ID", id)
							.addField("Order", foods.map((m) => "`" + titleCase(m) + "`").join("\n"))
							.addField("Customer", call.message.author.tag)
							.addField("Ordered From", orderedFromString)
							.addField("Status", "Awaiting Cook");
						ordersChannel.send({ embed: orderEmbed }).then((newMsg) => {
							orders.push({
								msg: newMsg,
								id: id,
								order: foods.map((m) => "`" + titleCase(m) + "`").join("\n"),
								customer: call.message.author.tag,
								orderedFrom: orderedFromString,
								status: "Awaiting Cook"
							});
							call.message.reply("Your order has been sent!").catch(() => {});
						}).catch(() => {
							call.message.reply("Couldn't deliver your order, please try again.").catch(() => {
								call.message.author.send(`You attempted to use the \`order\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						});
					} else {
						call.message.reply(`\nThese item(s) that you ordered are not on the menu:\n\n${noMenu.map((m) => `\`${m}\``).join("\n\n")}\n\nTherefore, your order has been cancelled.`)
							.catch(() => {
								call.message.author.send(`You attempted to use the \`order\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
					}
				} else {
					call.message.reply("You have exceeded the order limit of 3! Order cancelled.").catch(() => {
						call.message.author.send(`You attempted to use the \`order\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				call.message.reply("You must order at least one thing!").catch(() => {
					call.message.author.send(`You attempted to use the \`order\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You already send an order! To cancel it, use `!cancelorder`").catch(() => {
				call.message.author.send(`You attempted to use the \`order\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}

};
