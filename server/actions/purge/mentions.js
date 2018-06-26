module.exports = {
	id: "mentions",
	aliases: ["mention"],
	run: (call) => {
		var amountToPurge = call.params.readNumber() || NaN;
		if (!isNaN(amountToPurge) && amountToPurge > 0 && amountToPurge <= 100) {
			call.message.delete().then(() => {
				call.purgeMessages(amountToPurge, call.message.channel, (msg) => msg.mentions.users.size > 0).then((amountPurged) => {
					call.message.reply("Deleted " + amountPurged + " message" + ((amountPurged === 1) ? "" : "s") + " that contain" + ((amountPurged === 1) ? "" : "s") + " a user mention.")
						.then((msg) => msg.delete(5000))
						.catch(() => {});
				});
			});
		} else call.safeSend("Invalid amount of messages to delete. Please specify a number above 0 and below 100.");
	}
};
