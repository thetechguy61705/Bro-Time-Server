var { BotAccess } = require("../../data/server");

module.exports = {
	id: "data",
	exec(area, client, storage) {
		var data = new BotAccess(area, client);
		data.load();
		console.log("prefix loaded");
		storage.set("data", data);
	}
};
