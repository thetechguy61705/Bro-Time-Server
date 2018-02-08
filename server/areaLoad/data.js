var BotAccess = require("../../data/server");

module.exports = {
	exec: function(area, client) {
		area.data = new BotAccess(area, client);
		area.data.load();
	}
};
