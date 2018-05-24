var { GuildChannel } = require("discord.js");
var fs = require("fs");
var areaLoaders = [];

function load(area) {
	for (var areaLoader of areaLoaders)
		areaLoader.exec(area);
}

function loadChannel(channel) {
	if (!(channel instanceof GuildChannel))
		load(channel);
}

fs.readdirSync(__dirname + "/../areaLoad").forEach(file => {
	if (file.endsWith(".js"))
		areaLoaders.push(require("../areaLoad/" + file));
});

module.exports = {
	exec: (client) => {
		client.guilds.forEach(load);
		client.channels.forEach(loadChannel);
		client.on("guildCreate", load);
		client.on("channelCreate", loadChannel);
	}
};
