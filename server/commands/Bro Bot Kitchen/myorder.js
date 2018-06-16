const Discord = require("discord.js");
module.exports = {
	id: "myorder",
	description: "Sends your current order and its status",
	execute: (call) => {
		var ordersChannel = call.client.channels.get("399290151932526593");
		ordersChannel.fetchMessages({ limit: 100 }).then((orders) => {
			var filteredOrder = orders.find((m) => m && m.embeds && m.embeds[0] && m.embeds[0].fields[2].value === call.message.author.tag);
			if (filteredOrder) {
				var orderEmbed = new Discord.RichEmbed()
					.setColor("RED")
					.addField("Order", filteredOrder.embeds[0].fields[1].value)
					.addField("Status", filteredOrder.embeds[0].fields[4].value)
					.setFooter(`Ran by ${call.message.author.tag}`);
				call.message.channel.send(orderEmbed).catch(() => {
					call.message.author.send(`You attempted to use the \`myorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			} else {
				call.message.reply("❌ You do not have a current order! Run !order (item) to order something!").catch(() => {
					call.message.author.send(`You attempted to use the \`myorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		}).catch(() => {
			call.message.reply("Couldn't fetch current orders").catch(() => {
				call.message.author.send(`You attempted to use the \`myorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		});

	}
};