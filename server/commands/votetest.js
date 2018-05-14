module.exports = {
	id: "votetest",
	load: () => {},
	execute: (call) => {
		require("app/vote")(60000, call.message.channel, 2, () => true, `${call.message.guild.id} VOTE TEST`, "`<current>` out of <required> voted!")
			.then((result, users) => {
				if (result) {
					call.message.reply("YAYYY COOL BEANS DOOD!!!\n" + users.map(user => user.username).join("\n"));
				} else {
					call.message.reply(":( not many people voted :(");
				}
			}).catch(() => {
				call.message.reply("XD NOOB THE PROMISE GOT ***REJECTED***");
			});
	}
};
