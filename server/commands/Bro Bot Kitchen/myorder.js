const Discord = require("discord.js");
var orders = require("../../load/orders.js").orders;
module.exports = {
	id: "myorder",
	description: "Sends your current order and its status",
	execute: (call) => {
		var filteredOrder = orders.find((o) => o.customer === call.message.author.tag);
		if (filteredOrder != null) {
			var status = filteredOrder.status;
			if (status.startsWith("Claimed")) status = "Claimed";
			var orderEmbed = new Discord.RichEmbed()
				.setColor("RED")
				.addField("Order", filteredOrder.order)
				.addField("Status", status)
				.setFooter(`Ran by ${call.message.author.tag}`, call.message.author.displayAvatarURL);
			call.message.channel.send({ embed: orderEmbed }).catch(() => {
				call.message.author.send(`You attempted to use the \`myorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		} else {
			call.message.reply("❌ You do not have a current order! Run !order (item) to order something!").catch(() => {
				call.message.author.send(`You attempted to use the \`myorder\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
