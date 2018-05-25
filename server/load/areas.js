var { GuildChannel } = require("discord.js");
var fs = require("fs");
var areaLoaders = [];
var profiler;

async function load(area, client) {
	for (var areaLoader of areaLoaders) {
		var subProfiler = profiler.newSubProfiler(areaLoader.id.length + (areaLoader.profilerBytes || 2));
		subProfiler.writeStart(areaLoader.id);
		try {
			subProfiler.writeState(subProfiler.states.Started);
			var promise = areaLoader.exec(area, client, subProfiler);
			if (promise != null)
				await promise;
			subProfiler.writeState(subProfiler.states.Ended);
		} catch (exc) {
			subProfiler.writeState(subProfiler.states.Error);
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
	exec: (client, newProfiler) => {
		profiler = newProfiler;
		var promises = [];
		for (var guild of client.guilds)
			promises.push(load(guild, client));
		for (var channel of client.channels)
			promises.push(loadChannel(channel, client));
		client.on("guildCreate", load);
		client.on("channelCreate", loadChannel);
		return Promise.all(promises);
	}
};
