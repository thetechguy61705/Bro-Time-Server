module.exports = {
	id: "message-delete-update",
	exec: (client) => {
		client.on("message", (message) => {
			message.deleted = false;
		})

		client.on("messageDelete", (message) => {
			message.deleted = true;
		});
		client.on("messageDeleteBulk", (messages) => {
			for (let message of messages.array())
				message.deleted = true;
		});
	}
};
