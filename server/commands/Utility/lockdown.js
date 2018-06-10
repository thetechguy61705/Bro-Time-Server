module.exports = {
	id: "lockdown",
	execute: (call) => {
		call.client.locked = !call.client.locked;
		if (!call.client.locked) call.client.lockedChannels.length = 0;
		call.message.reply(`The client is now ${(call.client.locked) ? "inaccessible" : "accessible"}.`).catch(() => {});
	}
};
