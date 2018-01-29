var BotAccess = require("../../data/server");

module.exports = {
	exec: function(area) {
		area.data = new BotAccess(area);
		area.data.load();
	}
};
