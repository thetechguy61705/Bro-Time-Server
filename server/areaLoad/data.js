var { BotAccess } = require("@data/server");

module.exports = {
	id: "data",
	exec(area, client) {
		area.data = new BotAccess(area, client);
		area.data.load();
	}
};
