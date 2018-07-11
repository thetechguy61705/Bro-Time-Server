module.exports = {
	id: "match",
	aliases: ["equals"],
	run: (call) => {
		var amountToPurge = call.params.readNumber() || NaN,
			query = call.params.readParam(true);
		if (!isNaN(amountToPurge) && amountToPurge > 0 && amountToPurge <= 100) {
			if (query != null) {
				call.message.delete().then(() => {
					call.purgeMessages(amountToPurge, call.message.channel, (msg) => msg.content.toLowerCase() === query.toLowerCase()).then((amountPurged) => {
						call.message.reply("Deleted " + amountPurged + " message" + ((amountPurged === 1) ? "" : "s") + " that matched the given query from the current channel.")
							.then((msg) => msg.delete(5000))
							.catch(() => {});
					});
				});
			} else call.safeSend("Please give a valid query to match.");
		} else call.safeSend("Invalid amount of messages to delete. Please specify a number above 0 and below 100.");
	}
};
