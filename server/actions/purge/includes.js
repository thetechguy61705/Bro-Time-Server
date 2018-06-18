module.exports = {
	id: "includes",
	aliases: ["contains"],
	run: (call) => {
		var parameter = call.params.readParameter();
		var amountToPurge = Number((parameter != null) ? parameter : undefined),
			query = call.params.readParameter(true);
		if (!isNaN(amountToPurge) && amountToPurge > 0 && amountToPurge <= 100) {
			if (query != null) {
				call.message.delete().then(() => {
					call.purgeMessages(amountToPurge, call.message.channel, (msg) => msg.content.toLowerCase().includes(query.toLowerCase())).then((amountPurged) => {
						call.message.reply("Deleted " + amountPurged + " message" + ((amountPurged === 1) ? "" : "s") + " that includes the given query from the current channel.")
							.then((msg) => msg.delete(5000))
							.catch(() => {});
					});
				});
			} else {
				call.message.reply("Please give a valid query to match.").catch(() => {
					call.message.author.send(`You attempted to run the \`purge\` command in ${call.message.channel}, but I do not have permission to chat there.`);
				});
			}
		} else {
			call.message.reply("Invalid amount of messages to delete. Please specify a number above 0 and below 500.").catch(() => {
				call.message.author.send(`You attempted to run the \`purge\` command in ${call.message.channel}, but I do not have permission to chat there.`);
			});
		}
	}
};
