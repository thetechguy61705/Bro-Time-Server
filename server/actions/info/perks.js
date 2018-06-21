const fs = require("fs");

module.exports = {
	id: "perks",
	aliases: ["donations"],
	run: (call) => {
		fs.readFile(__dirname + "/../../info/perks.md", (err, data) => {
			if (err) {
				console.error(err.stack);
			} else {
				call.safeSend(data.toString("utf8"));
			}
		});
	}
};
