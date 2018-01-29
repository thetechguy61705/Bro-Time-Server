var BotAccess = require("../../data/server");

module.exports = {
	exec: function(client) {
		client.data = new BotAccess(client);
	}
};
