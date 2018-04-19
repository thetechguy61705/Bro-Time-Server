var { BotAccess } = require("../../data/data");

module.exports = {
	async exec(area, client) {
		area.data = new BotAccess(area, client);
		await area.data.load();
	}
};
