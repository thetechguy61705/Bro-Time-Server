const isWorker = require("app/workers");
const { RichEmbed } = require("discord.js");
const { addOrder, delOrder, orders } = require("../../load/orders.js");

function titleCase(str) {
	var newString = "";
	for (let i = 0; i < str.length; i++) {
		newString += (i === 0 || str.charAt(i - 1) === " ") ? str.charAt(i).toUpperCase() : str.charAt(i).toLowerCase();
	}
	return newString;
}

function isURL(str) {
	var pattern = new RegExp("^(https?:\\/\\/)?"+
	"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|"+
	"((\\d{1,3}\\.){3}\\d{1,3}))"+
	"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+
	"(\\?[;&a-z\\d%_.~+=-]*)?"+
	"(\\#[-a-z\\d_]*)?$", "i");
	return pattern.test(str);
	// credit to Tom Gullen https://stackoverflow.com/users/356635/tom-gullen from stackoverflow <3
}

module.exports = {
	id: "cook",
	description: "Cooks someone's order",
	paramsHelp: "(order number) | (food/drink) | (link)",
	access: "Public",
	execute: (call) => {
		if (!call.client.bbkLocked) {
			var kitchenServer = call.client.guilds.get("398948242790023168"),
				member = kitchenServer.members.get(call.message.author.id);
			if (member != null && isWorker(member)) {
				if (call.message.content.split("|")[1] && call.message.content.split("|")[2]) {
					var code = call.params.readParameter().trim();
					var food = titleCase(call.message.content.split("|")[1].trim());
					var link = call.message.content.split("|")[2].trim().toLowerCase();
					if (code != null && food != null && link != null) {
						var filteredOrder = orders.find((o) => o.id === code.toUpperCase());
						if (filteredOrder != null) {
							if (filteredOrder.status !== "Awaiting Cook") {
								if (filteredOrder.status.includes(call.message.author.tag)) {
									var foods = filteredOrder.order.replace(/`/gi, "")
										.split("\n")
										.map((m) => m.toLowerCase())
										.filter((m) => !filteredOrder.links.toLowerCase().includes(m.toLowerCase()));
									if (foods.includes(food.toLowerCase())) {
										if (isURL(link)) {
											var links;
											if (filteredOrder.links !== "None") {
												links = filteredOrder.links + `\n${food} - ${link}`;
											} else {
												links = `${food} - ${link}`;
											}
											var status = `Cooking (${call.message.author.tag})`;
											var justFoods = filteredOrder.order.split("\n");
											var justLinks = filteredOrder.links.split("\n");
											if (justFoods.length <= justLinks.length + 1) {
												status = `Cooked (${call.message.author.tag})`;
											}
											var orderEmbed = new RichEmbed()
												.setColor("RED")
												.addField("Order ID", filteredOrder.id)
												.addField("Order", filteredOrder.order)
												.addField("Customer", filteredOrder.customer)
												.addField("Ordered From", filteredOrder.orderedFrom)
												.addField("Status", status)
												.addField("Links", links);
											filteredOrder.msg.edit({ embed: orderEmbed }).then(() => {
												addOrder(filteredOrder.msg, filteredOrder.id, filteredOrder.order, filteredOrder.customer, filteredOrder.orderedFrom, status, links);
												delOrder(filteredOrder);
												call.message.reply("Successfully cooked this item.").catch(() => {});
											}).catch(() => {
												call.safeSend("Couldn't cook this food, please try again");
											});
										} else call.safeSend("Not a valid link");
									} else call.safeSend("Not a valid food/drink to cook, or was already cooked");
								} else call.safeSend("You can only cook orders claimed by you!");
							} else call.safeSend("You must claim orders before you can cook them!");
						} else call.safeSend("Not a valid order ID!");
					} else call.safeSend("You didn't supply the correct parameters! Usage: `!cook (order number) | (food/drink) | (link)`");
				} else call.safeSend("You didn't supply the correct parameters! Usage: `!cook (order number) | (food/drink) | (link)`");
			} else call.safeSend("You don't have permission to use this command!");
		} else {
			if (!call.client.bbkLockedChannels.includes(call.message.channel.id)) {
				call.client.bbkLockedChannels.push(call.message.channel.id);
				call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
			}
		}
	}
};
