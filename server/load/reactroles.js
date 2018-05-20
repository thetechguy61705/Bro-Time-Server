//const Discord = require("discord.js");
module.exports = {
	exec: (client) => {
		/*
		const freeRoles = ["QOTD", "ANN", "GW", "MOVIES", "Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
		"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
		"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
		"Call of Duty", "Destiny", "Psych"];
		*/
		client.channels.get("447205162436788235").fetchMessages({ limit: 100 }).then(messages => {
			console.log("1");
			if (messages.size > 0) {
				console.log("2");
				messages.forEach(message => {
					console.log("3");
					if (message.author.id !== client.user.id) {
						console.log("4");
						if (message.reactions.has("404768960014450689")) {
							console.log("5");
							const filter = (reaction) => reaction.emoji.id === "404768960014450689";
							const collector = message.createReactionCollector(filter);
							collector.on("collect", reaction => {
								console.log("6");
								var member = message.guild.member(reaction.users.last());
								if (member) {
									console.log("7");
									if (member.roles.has(message.guild.roles.find("name", message.embeds[0].title))) {
										console.log("8");
										member.removeRole(message.guild.roles.find("name", message.embeds[0].title));
									} else {
										console.log("9");
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
};
