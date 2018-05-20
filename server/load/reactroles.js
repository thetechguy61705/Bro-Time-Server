const Discord = require("discord.js");
module.exports = {
	exec: (client) => {
		if (client.user.id === "393532251398209536") {
			const freeRoles = ["QOTD", "ANN", "GW", "MOVIES", "Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
			"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
			"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
			"Call of Duty", "Destiny", "Psych"];
			client.channels.get("447205162436788235").fetchMessages({ limit: 100 }).then(messages => {
				if (messages.size > 0) {
					messages.forEach(message => {
						if (message.author.id === client.user.id) {
							if (message.reactions.has("404768960014450689")) {
								const filter = (reaction, user) => reaction.emoji.id === "404768960014450689";
								const collector = message.createReactionCollector(filter);
								collector.on("collect", reaction => {
									var member = message.guild.member(reaction.users.last());
									if (member) {
										if (member.roles.has(message.guild.roles.find("name", message.embeds[0].title))) {
											member.removeRole(message.guild.roles.find("name", message.embeds[0].title));
										} else {
											member.addRole(message.guild.roles.find("name", message.embeds[0].title));
										}
									}
								});
							}
						}
					});
				}
			});
		}
	}
};
