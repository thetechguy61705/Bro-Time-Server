const { GuildChannel } = require("discord.js");
const { load } = require("@utility/filesloader.ts");

const LOAD_TIMEOUT = 60000;

module.exports = {
	id: "areas",
	exec: (client) => {
		return load("areaLoad", {
			client: client,
			displayErrorStack: false,
			success: (exported) => {
				for (var guild of client.guilds.values())
					exported.exec(guild, client);
				for (var channel of client.channels.values()) {
					if (!(channel instanceof GuildChannel))
						exported.exec(channel, client);
				}
				client.on("guildCreate", (guild) => exported.exec(guild, client));
				client.on("channelCreate", (channel) => {
					if (!(channel instanceof GuildChannel))
						exported.exec(channel, client);
				});
			},
			failure: (exc) => {
				console.warn("Failed to load area:");
				throw exc;
			},
			TimeoutTime: LOAD_TIMEOUT,
			timeout: (exc) => {
				throw exc;
			},
			predicate: (exported) => {
				return !exported.needs || client.guilds.has(exported.needs);
			}
		});
	}
};
