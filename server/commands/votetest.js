var vote = require("@utility/vote");

module.exports = {
	id: "votetest",
	exec: (call) => {
		vote({
			time: 60000,
			channel: call.message.channel,
			required: 2,
			id: `${call.message.guild.id} VOTE TEST`,
			content: "`<current>` out of `<required>` voted!",
			user: call.message.author
		}).then((result) => {
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
