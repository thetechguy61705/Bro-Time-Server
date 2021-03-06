module.exports = {
	id: "default",
	run: (call, actions, parameter) => {
		var amountToPurge = Number((parameter !== "") ? parameter : undefined),
			user = call.params.readParam();
		user = (user != null) ? call.message.guild.members.find((member) => user.includes(member.id) || member.user.tag.toLowerCase().startsWith(user.toLowerCase())) : null;
		var filter = (user != null) ? (msg) => msg.author.id === user.id : () => true;
		if (!isNaN(amountToPurge) && amountToPurge > 0 && amountToPurge <= 100) {
			call.message.delete().then(() => {
				call.purgeMessages(amountToPurge, call.message.channel, filter).then((amountPurged) => {
					call.message.reply("Deleted " + amountPurged + " message" + ((amountPurged === 1) ? "" : "s") + " from the current channel.")
						.then((msg) => msg.delete(5000))
						.catch(() => {});
				});
			});
		} else call.safeSend("Please specify a number above 0 and below or equal to 100 or a purge action from one of the following: `" +  actions.keyArray().join("`, `") + "`.");
	}
};
