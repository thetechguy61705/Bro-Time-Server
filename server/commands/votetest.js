var vote = require("app/vote");

module.exports = {
	id: "votetest",
	execute: (call) => {
		vote(60000, call.message.channel, 2, () => true, `${call.message.guild.id} VOTE TEST`, "`<current>` out of <required> voted!", call.message.author)
			.then((result) => {
				if (result) {
					call.message.reply("YAYYY COOL BEANS DOOD!!!");
				} else {
					call.message.reply(":( not many people voted :(");
				}
			}).catch(() => {
				call.message.reply("XD NOOB THE PROMISE GOT ***REJECTED***");
			});
	}
};
