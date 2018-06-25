module.exports = {
	id: "delete",
	run: (call) => {
		if (call.message.guild.channels.find((c) => c.topic === call.message.author.id) != null) {
			var userChannel = call.message.guild.channels.find((c) => c.topic === call.message.author.id);
			userChannel.delete().then(() => {
				call.safeSend("Deleted your private channel.");
			});
		} else {
			call.safeSend("You don't have a channel!");
		}
	}
};
