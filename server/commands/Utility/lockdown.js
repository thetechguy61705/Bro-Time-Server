const Moderator = require("@utility/moderator");
const server = require("@server/server")

module.exports = {
	id: "lockdown",
	description: "Locks down the bot preventing any chat handlers from functioning.",
	aliases: ["unlockdown"],
	access: "Public",
	execute: (call) => {
		if (Moderator(call.message.member)) {
			server.locked.value = !server.locked.value;
			if (!server.locked) server.locked.channels.length = 0;
			call.message.reply(`The client is now ${(server.locked.value) ? "inaccessible" : "accessible"}.`);
		}
	}
};
