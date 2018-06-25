var { MENU } = require("app/menu");
function randomLetters(num) {
	var abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	var random = "";
	for (let i = 0; i < num; i++) {
		random += abc[Math.floor(Math.random() * abc.length)];
	}
	return random;
}
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
	access: "Server",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		} else if (call.client.bbkLocked) {
			return;
		}
		var filteredOrder = orders.find((o) => o.customer === call.message.author.tag);
		if (!filteredOrder) {
			var foods = call.params.readRaw().split(",").map((val) => val.trim().toLowerCase());
			if (foods[0] !== "") {
				if (foods.length < 4) {
					var noMenu = [];
					for (let food of foods) {
						if (!MENU.find((item) => item.toLowerCase() === food)) {
							noMenu.push(food.toLowerCase());
						}
					}
					if (noMenu.length === 0) {
						if (foods.find((val) => foods.filter((v) => v === val).length > 1) == null) {
							var id = randomLetters(3),
								ordersChannel = call.client.channels.get("399290151932526593"),
								orderedFromString = `${call.message.channel.toString()} (${call.message.channel.id}) in ${call.message.guild.name} (${call.message.guild.id})`;
							var orderEmbed = new RichEmbed()
								.setColor("RED")
								.addField("Order ID", id)
								.addField("Order", foods.map((m) => "`" + titleCase(m) + "`").join("\n"))
								.addField("Customer", call.message.author.tag)
								.addField("Ordered From", orderedFromString)
								.addField("Status", "Awaiting Cook")
								.addField("Links", "None");
							ordersChannel.send({ embed: orderEmbed }).then((newMsg) => {
								orders.push({
									msg: newMsg,
									id: id,
									order: foods.map((m) => "`" + titleCase(m) + "`").join("\n"),
									customer: call.message.author.tag,
									orderedFrom: orderedFromString,
									status: "Awaiting Cook",
									links: "None",
								});
								call.message.reply("Your order has been sent!").catch(() => {});
							}).catch(() => {
								call.safeSend("Couldn't deliver your order, please try again.");
							});
						} else call.safeSend("You cannot order duplicate items!");
					} else call.safeSend(`\nThese item(s) that you ordered are not on the menu:\n\n${noMenu.map((m) => `\`${m}\``).join("\n\n")}\n\nTherefore, your order has been cancelled.`);
				} else call.safeSend("You have exceeded the order limit of 3! Order cancelled.");
			} else call.safeSend("You must order at least one thing!");
		} else call.safeSend("You already send an order! To cancel it, use `!cancelorder`");
	}
};
