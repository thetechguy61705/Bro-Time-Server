const Moderator = require("app/moderator");

module.exports = {
	id: "lockdown",
	description: "Locks down the bot preventing any chat handlers from functioning.",
	aliases: ["unlockdown"],
	access: "Public",
	execute: (call) => {
		if (Moderator(call.message.member)) {
			call.client.locked = !call.client.locked;
			if (!call.client.locked) call.client.lockedChannels.length = 0;
			call.message.reply(`The client is now ${(call.client.locked) ? "inaccessible" : "accessible"}.`);
		}
	}
};
