var { getMenu } = require("app/menu");
module.exports = {
	id: "menu",
	description: "Sends you the menu",
	execute: (call) => {
		call.message.channel.send({ embed: getMenu(call.message.author) }).catch(() => {
			call.message.author.send(`You attempted to use the \`menu\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
		});
	}
};
