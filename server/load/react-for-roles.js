const Discord = require("discord.js");

const freeRoles = ["QOTD", "ANN", "GW", "MOVIES", "Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
	"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
	"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
	"Call of Duty", "Destiny", "Psych", "Bro Time Games"];

module.exports = {
	id: "reactroles",
	exec: (client) => {
		if (client.user.id === "393532251398209536") {
			var channel = client.channels.get("447205162436788235");
			if (channel != null) {
				channel.fetchMessages({ limit: freeRoles.length }).then((messages) => {
					messages = messages.filter((msg) => msg.author.id === client.user.id && msg.embeds[0] != null);
					for (let message of messages.array()) {
						if (!message.reactions.has("pixeldolphin:404768960014450689"))
							message.react("404768960014450689");
					}

					if (freeRoles.difference(messages.map((message) => message.embeds[0].title)).length > 0) {
						for (let newItem of freeRoles.difference(messages.map((message) => message.embeds[0].title))) {
							const newItemEmbed = new Discord.RichEmbed()
								.setTitle(newItem)
								.setColor(client.guilds.get("330913265573953536").roles.find("name", newItem).hexColor);
							client.channels.get("447205162436788235").send({ embed: newItemEmbed }).then((newItemMessage) => {
								messages.set(newItemMessage.id, newItemMessage);
								newItemMessage.react("404768960014450689");
							});
						}
					}

					client.on("messageReactionAdd", (reaction, user) => {
						if (messages.some((msg) => msg.id === reaction.message.id) && reaction.emoji.id === "404768960014450689" && user.id !== client.user.id) {
							reaction.remove(user);
							var member = channel.guild.member(user);
							if (member != null) {
								if (member.roles.has(channel.guild.roles.find("name", reaction.message.embeds[0].title).id)) {
									member.removeRole(channel.guild.roles.find("name", reaction.message.embeds[0].title));
								} else {
									member.addRole(channel.guild.roles.find("name", reaction.message.embeds[0].title));
								}
							}
						}
					});
				});
			}
		}
	}
};
