const fs = require("fs");

module.exports = {
	id: "advertisement",
	aliases: ["ad"],
	run: (call) => {
		fs.readFile(__dirname + "/../../info/ad.md", (err, data) => {
			if(err) {
				throw err;
			} else {
				var advertisement = data.toString("utf8");
				if ((call.params.readParameter() || "").toLowerCase() === "computer") advertisement = "```" + advertisement + "```";
				call.safeSend(advertisement);
			}
		});
	}
};
