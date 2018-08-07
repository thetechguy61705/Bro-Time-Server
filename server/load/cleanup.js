module.exports = {
	id: "cleanup",
	exec: (client) => {
		client.on("typingStart", (channel, user) => {
			client.setTimeout(() => {
				if (user.id === client.user.id && user.typingIn(channel)) channel.stopTyping();
			}, 10000);
		});
	}
};
