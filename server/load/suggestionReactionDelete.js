module.exports = {
	id: "suggest-reaction",
	exec: (client) => {
		client.shard.broadcastEval(
			"var channels = [];" +
			"for (let guild of this.guilds.array()) {" +
				"var suggestionChannel = guild.channels.find((c) => {" +
					"return c.name === 'suggestions' && c.type === 'text' && c.permissionsFor(guild.me).has(['READ_MESSAGES', 'SEND_MESSAGES', 'EMBED_LINKS']);" +
				"});" +
				"if (suggestionChannel != null) {" +
					"channels.push(suggestionChannel.id);" +
				"}" +
			"}" +
			"for (let channel of channels) this.channels.get(channel).fetchMessages({ limit: 100 });" +
			"this.on('messageReactionAdd', (reaction, user) => {" +
				"if (channels.includes(reaction.message.channel.id) &&" +
					"reaction.message.author.id === this.user.id &&" +
					"reaction.emoji.name === '🗑' &&" +
					"reaction.message.embeds[0] && reaction.message.embeds[0].footer.text.endsWith(`(${user.id})`)) {" +
					"if (reaction.message.deletable) {" +
						"reaction.message.delete();" +
						"require('@server/commands/Posting/suggest.ts').cooldown.splice(require('@server/commands/Posting/suggest.ts').cooldown.indexOf(`${user.id} ${reaction.message.guild.id}`), 1);" +
					"}" +
				"}" +
			"});" +
			"'non circular object';"
		);
	}
};
