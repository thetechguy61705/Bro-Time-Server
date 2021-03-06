const store = require("@utility/store");
const Discord = require("discord.js");

module.exports = {
	id: "store",
	aliases: ["shop"],
	description: "Shows you the store.",
	access: "Public",
	exec: (call) => {
		var storeEmbed = new Discord.RichEmbed()
			.setTitle("Store")
			.setColor("GREEN")
			.setFooter("soon:tm:");
		for (let item of Object.values(store)) {
			storeEmbed.addField(item.name, `Price: \`${item.price}\`\nDescription: \`${item.description}\``);
		}
		call.safeSend({ embed: storeEmbed });
	}
};
