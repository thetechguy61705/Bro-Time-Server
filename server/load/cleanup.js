module.exports = {
	id: "cleanup",
	exec: (client) => {
		// Force stop typing after 10 seconds if typing.
		client.on("typingStart", (channel, user) => {
			client.setTimeout(() => {
				if (user.id === client.user.id && user.typingDurationIn() >= 10000) channel.stopTyping();
			}, 10000);
		});
	}
};
