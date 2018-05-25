var { Guild } = require("discord.js");
var config = require("../../config");

module.exports = {
	id: "names",
	exec(area) {
		if (area instanceof Guild && config.NAMES[area.id] != null)
			area.members.get(area.client.user.id).setNickname(config.NAMES[area.id]);
	}
};
