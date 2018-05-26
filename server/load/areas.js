var { GuildChannel } = require("discord.js");
var fs = require("fs");
var areaLoaders = [];

async function load(area, client) {
	for (var areaLoader of areaLoaders) {
		try {
			var promise = areaLoader.exec(area, client);
			if (promise != null)
				await promise;
		} catch (exc) {
			console.warn(exc.stack);
		}
	}
}

function loadChannel(channel, client) {
	if (!(channel instanceof GuildChannel))
		return load(channel, client);
}

fs.readdirSync(__dirname + "/../areaLoad").forEach(file => {
	if (file.endsWith(".js"))
		areaLoaders.push(require("../areaLoad/" + file));
});

module.exports = {
	id: "areas",
	exec: (client) => {
		var promises = [];
		for (var guild of client.guilds.values())
			promises.push(load(guild, client));
		for (var channel of client.channels.values())
			promises.push(loadChannel(channel, client));
		client.on("guildCreate", load);
		client.on("channelCreate", loadChannel);
		return Promise.all(promises);
	}
};
