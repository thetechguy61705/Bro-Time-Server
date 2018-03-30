const fs = require("fs")

module.exports = {
	id: "testyoyoyo",
	load: () => {},
	execute: (call) => {
		var commandDescs;
		fs.readFile(__dirname + "/../info/commandinfo.md", (err, data) => {
			if(err) {
				throw err;
			} else {
				commandDescs = data.toString("utf8");
			}
		});
		call.message.channel.send("1: "+commandDescs);
		call.channel.send("2: "+commandDescs.split("\n"));
	}
};
