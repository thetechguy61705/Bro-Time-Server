const fs = require("fs");

module.exports = {
	id: "advertisement",
	aliases: ["ad"],
	run: (call, actions) => {
		fs.readFile(__dirname + "/../../info/ad.md", (err, data) => {
			if(err) {
				throw err;
			} else {
				var advertisement = data.toString("utf8");
				if ((call.params.readParameter() || "").toLowerCase() === "computer") advertisement = "```" + advertisement + "```";
				call.message.channel.send(advertisement).catch(() => {
					call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
	});
	}
};
