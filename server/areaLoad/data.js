var { BotAccess } = require("../../data/server");

module.exports = {
	async exec(area) {
		area.data = new BotAccess(area, area.client);
		await area.data.load();
	}
};
