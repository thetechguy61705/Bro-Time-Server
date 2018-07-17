const SUGGEST_COMMAND = require("@server/commands/Posting/suggest.ts")

module.exports = {
	id: "suggest-reaction",
	exec: (client) => {
		var channels = [];
		for (let guild of client.guilds.array()) {
			var suggestionChannel = guild.channels.find((c) => {
				return c.name === "suggestions" && c.type === "text" && c.permissionsFor(guild.me).has(["READ_MESSAGES", "SEND_MESSAGES", "EMBED_LINKS"]);
			});
			if (suggestionChannel != null) {
				channels.push(suggestionChannel.id);
			}
		}

		var channelFetching = [];
		for (let channel of channels) channelFetching.push(client.channels.get(channel).fetchMessages({ limit: 100 }));

		Promise.all(channelFetching).then(() => {
			client.on("messageReactionAdd", (reaction, user) => {
				if (channels.includes(reaction.message.channel.id) &&
					reaction.message.author.id === client.user.id &&
					reaction.emoji.name === "🗑" &&
					reaction.message.embeds[0] && reaction.message.embeds[0].footer.text.endsWith(`(${user.id})`)) {
					if (reaction.message.deletable) {
						reaction.message.delete();
						SUGGEST_COMMAND.cooldown.splice(SUGGEST_COMMAND.cooldown.indexOf(`${user.id} ${reaction.message.guild.id}`), 1);
					}
				}
			});
		});
	}
};
