var { BotAccess } = require("@data/server.ts");

module.exports = {
	id: "data",
	exec(area, client) {
		area.data = new BotAccess(area, client);
		area.data.load();
	}
};
