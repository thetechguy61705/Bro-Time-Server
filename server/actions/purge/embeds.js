module.exports = {
	id: "embeds",
	aliases: ["embed"],
	run: (call) => {
		var parameter = call.params.readParameter();
		var amountToPurge = Number((parameter != null) ? parameter : undefined);
		if (!isNaN(amountToPurge) && amountToPurge > 0 && amountToPurge <= 100) {
			call.message.delete().then(() => {
				call.purgeMessages(amountToPurge, call.message.channel, (msg) => msg.embeds.filter((e) => e.type === "rich").length > 0).then((amountPurged) => {
					call.message.reply("Deleted " + amountPurged + " message" +
						((amountPurged === 1) ? "" : "s") +
						" with embeds in " +
						((amountPurged === 1) ? "it" : "them") +
						" from the current channel.")
						.then((msg) => msg.delete(5000))
						.catch(() => {});
				});
			});
		} else call.safeSend("Invalid amount of messages to delete. Please specify a number above 0 and below 500.");
	}
};
