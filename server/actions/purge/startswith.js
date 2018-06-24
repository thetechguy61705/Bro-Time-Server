module.exports = {
	id: "startswith",
	aliases: ["starts"],
	run: (call) => {
		var parameter = call.params.readParameter();
		var amountToPurge = Number((parameter != null) ? parameter : undefined),
			query = call.params.readParameter(true);
		if (!isNaN(amountToPurge) && amountToPurge > 0 && amountToPurge <= 100) {
			if (query != null) {
				call.message.delete().then(() => {
					call.purgeMessages(amountToPurge, call.message.channel, (msg) => msg.content.toLowerCase().startsWith(query.toLowerCase())).then((amountPurged) => {
						call.message.reply("Deleted " + amountPurged + " message" + ((amountPurged === 1) ? "" : "s") + " that started with the given query from the current channel.")
							.then((msg) => msg.delete(5000))
							.catch(() => {});
					});
				});
			} else call.safeSend("Please give a valid query to match.");
		} else call.safeSend("Invalid amount of messages to delete. Please specify a number above 0 and below 100.");
	}
};
