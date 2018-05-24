var { BotAccess } = require("../../data/server");

module.exports = {
	exec(area) {
		area.data = new BotAccess(area, area.client);
		area.data.load();
	}
};
