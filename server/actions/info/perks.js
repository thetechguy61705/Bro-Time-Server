const fs = require("fs");

module.exports = {
	id: "perks",
	aliases: ["donations"],
	run: (call, actions) => {
		fs.readFile(__dirname + "/../../info/perks.md", (err, data) => {
			if (err) {
				console.error(err.stack);
			} else {
				call.message.channel.send(data.toString("utf8")).catch(() => {
					call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		});
	}
};
