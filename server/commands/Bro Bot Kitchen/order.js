var menu = require("app/menu").menu;
var random = require("random-letters");
const Discord = require("discord.js");
module.exports = {
	id: "order",
	description: "Orders food",
	paramsHelp: "(item), [item2], [item3]",
	execute: (call) => {
		var foods = call.params.readRaw().split(",").map((val) => val.trim());
		if(foods[0] !== ``) { // eslint-disable-line quotes
			if(foods.length < 4) {
				var noMenu = [];
				for (let food of foods) {
					if(!menu.includes(food.toLowerCase())) {
						noMenu.push(food.toLowerCase());
					}
				}
				if(noMenu.length === 0) {
					var id = random(3).toUpperCase();
					var ordersChannel = call.client.channels.get("399290151932526593");
					var orderedFromString = `${call.message.channel.toString()} (${call.message.channel.id}) in ${call.message.channel.guild.name} (${call.message.channel.guild.id})`;
					var orderEmbed = new Discord.RichEmbed()
						.setColor("RED")
						.addField("Order ID", id)
						.addField("Order", foods.map((m) => `\`${m}\``).join("\n"))
						.addField("Customer", call.message.author.tag)
						.addField("Ordered From", orderedFromString)
						.addField("Status", "Awaiting Cook");
					ordersChannel.send(orderEmbed).then(() => {
						call.message.reply("Your order has been sent!").catch(() => {
							call.message.author.send(`You attempted to use the \`order\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
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
	}
};