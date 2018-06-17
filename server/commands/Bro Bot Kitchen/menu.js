const Discord = require("discord.js");
var menu = require("app/menu").menu;
function titleCase(str) {
	str = str.toUpperCase();
	str = str.split(" ");
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0) + str[i].slice(1);
	}
	return str.join(" ");
}
module.exports = {
	id: "menu",
	description: "Sends you the menu",
	execute: (call) => {
		var menuEmbed = new Discord.RichEmbed()
			.setColor("RED")
			.setTitle("Menu")
			.setFooter(`Max: 3 | Ran by ${call.message.author.tag}`)
			.setDescription(menu.map((m) => titleCase(m)).join("\n"));
		call.message.channel.send(menuEmbed).catch(() => {
			call.message.author.send(`You attempted to use the \`menu\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
		});
	}
};
