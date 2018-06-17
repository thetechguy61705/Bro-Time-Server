var menu = require("app/menu").menuEmbed;


module.exports = {
	id: "menu",
	description: "Sends you the menu",
	execute: (call) => {
		menu.setFooter(`Max: 3 | Ran by ${call.message.author.tag}`);
		call.message.channel.send(menu).catch(() => {
			call.message.author.send(`You attempted to use the \`menu\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
		});
	}
};
