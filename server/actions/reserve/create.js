var reservedChannels = require("../../commands/Utility/reserve.js").reservedChannels;
module.exports = {
	id: "create",
	run: (call) => {
		if (call.message.guild.channels.find((c) => c.topic === call.message.author.id) == null) {
			call.message.guild.createChannel(`${call.message.author.username}-${call.message.author.discriminator}`, "text",
				[{ allow: ["READ_MESSAGES"], id: call.message.author }, { deny: ["READ_MESSAGES"], id: call.message.guild.id }]).then((newChannel) => {
				call.message.guild.channels.set(newChannel.id, newChannel);
				newChannel.setParent("460288104851308544").then(() => {
					newChannel.setTopic(call.message.author.id).then(() => {
						call.safeSend(`Your new channel is ${newChannel.toString()}`);
					});
				});
			});
		} else {
			call.safeSend("You already have a channel!");
		}
	}
};