const Discord = require("discord.js");
var orders = require("../../load/orders.js").orders;
module.exports = {
	id: "myorder",
	description: "Sends your current order and its status",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		} else if (call.client.bbkLocked) {
			return;
		}
		var filteredOrder = orders.find((o) => o.customer === call.message.author.tag);
		if (filteredOrder != null) {
			var status = filteredOrder.status;
			if (status.startsWith("Claimed")) status = "Claimed";
			var orderEmbed = new Discord.RichEmbed()
				.setColor("RED")
				.addField("Order", filteredOrder.order)
				.addField("Status", status)
				.setFooter(`Ran by ${call.message.author.tag}`, call.message.author.displayAvatarURL);
			call.safeSend(null, call.message, { embed: orderEmbed });
		} else call.safeSend("❌ You do not have a current order! Run !order (item) to order something!");
	}
};
