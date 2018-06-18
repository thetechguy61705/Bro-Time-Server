var { getMenu } = require("app/menu");
module.exports = {
	id: "menu",
	description: "Sends you the menu",
	execute: (call) => {
		if (call.client.bbkLocked && !call.client.bbkLockedChannels.includes(call.message.channel.id)) {
			call.client.bbkLockedChannels.push(call.message.channel.id);
			return call.message.channel.send("Bro Bot Kitchen is currently in lockdown and inaccessible by any user.");
		}
		call.message.channel.send({ embed: getMenu(call.message.author) }).catch(() => {
			call.message.author.send(`You attempted to use the \`menu\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
		});
	}
};
