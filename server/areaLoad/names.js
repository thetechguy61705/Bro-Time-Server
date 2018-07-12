var { GuildChannel } = require("discord.js");
var config = require("@root/config");

module.exports = {
	id: "names",
	exec(area) {
		if (area instanceof GuildChannel && config.NAMES[area.id] != null)
			area.members.get(area.client.user.id).setNickname(config.NAMES[area.id]);
	}
};
