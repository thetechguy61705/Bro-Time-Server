const Discord = require("discord.js");

module.exports = {
	exec: (client) => {
		const amountUntilStarboard = 1;
		const testGuild = client.guilds.get("430096406275948554");
		const realGuild = client.guilds.get("330913265573953536");
		client.on("messageReactionAdd", (messageReaction) => {
			if (messageReaction.message.guild.id === realGuild.id) {
				var starReactions = messageReaction.message.reactions.find(reaction => reaction.emoji.name === "⭐");
				var count = starReactions.count;
				if (starReactions.users.get(messageReaction.message.author.id)) count = count - 1;
				if (count >= amountUntilStarboard) {
					var starboardEmbed = new Discord.RichEmbed()
						.setAuthor(messageReaction.message.author.tag, messageReaction.message.author.avatarURL)
						.setDescription(messageReaction.message.content)
						.setColor("ORANGE");
					if (messageReaction.message.attachments.size !== 0) {
						starboardEmbed = starboardEmbed.setImage(messageReaction.message.attachments.first().url);
					}

					var loopStop = 0;
					var starboardChannel = realGuild.channels.find("name", "starboard");
					starboardChannel.fetchMessages({
						limit: 100
					}).then(msgs => {
						msgs.forEach(msg => {
							loopStop = loopStop + 1;
							if (msg.content.includes(`${messageReaction.message.id}`)) {
								loopStop = loopStop - 1;
								msg.edit(`**${count} ⭐ ${messageReaction.message.channel} ID:** ${messageReaction.message.id}`, {
									embed: starboardEmbed
								});
							}
							if (loopStop === msgs.size) {
								starboardChannel.send(`**${count} ⭐ ${messageReaction.message.channel} ID:** ${messageReaction.message.id}`, {
									embed: starboardEmbed
								});
							}
						});
					});
				}
			}
		});

		client.on("messageReactionRemove", (messageReaction) => {
			if (messageReaction.message.guild.id === testGuild.id) {
				var starReactions = messageReaction.message.reactions.find(reaction => reaction.emoji.name === "⭐");
				var count = starReactions.count;
				if (starReactions.users.get(messageReaction.message.author.id)) count = count - 1;
				var starboardEmbed = new Discord.RichEmbed()
					.setAuthor(messageReaction.message.author.tag, messageReaction.message.author.avatarURL)
					.setDescription(messageReaction.message.content)
					.setColor("ORANGE");
				if (messageReaction.message.attachments.size !== 0) {
					starboardEmbed = starboardEmbed.setImage(messageReaction.message.attachments.first().url);
				}
				var loopStop = 0;
				var starboardChannel = realGuild.channels.find("name", "starboard");
				starboardChannel.fetchMessages({
					limit: 100
				}).then(msgs => {
					msgs.forEach(msg => {
						loopStop = loopStop + 1;
						if (msg.content.includes(`${messageReaction.message.id}`)) {
							loopStop = loopStop - 1;
							if (count < amountUntilStarboard) {
								msg.delete();
							} else {
								msg.edit(`**${count} ⭐ ${messageReaction.message.channel} ID:** ${messageReaction.message.id}`, {
									embed: starboardEmbed
								});
							}
						}
					});
				});
			}
		});
	}
};
