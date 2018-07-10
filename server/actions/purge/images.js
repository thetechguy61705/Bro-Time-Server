module.exports = {
	id: "images",
	aliases: ["image"],
	run: (call) => {
		var amountToPurge = call.params.readNumber() || NaN;
		if (!isNaN(amountToPurge) && amountToPurge > 0 && amountToPurge <= 100) {
			call.message.delete().then(() => {
				call.purgeMessages(amountToPurge, call.message.channel, (msg) => msg.attatchments && msg.attachments.find((att) => att.width != null) != null).then((amountPurged) => {
					call.message.reply("Deleted " +
						amountPurged +
						" message" +
						((amountPurged === 1) ? "" : "s") +
						" that " +
						((amountPurged === 1) ? "has" : "have") +
						" an image from the current channel.")
						.then((msg) => msg.delete(5000))
						.catch(() => {});
				});
			});
		} else call.safeSend("Invalid amount of messages to delete. Please specify a number above 0 and below 100.");
	}
};
