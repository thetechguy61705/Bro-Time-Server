const Discord = require("discord.js");

module.exports = {
	exec: (client) => {
		console.log("im rly sad pls dont log this that means i messed up badly");
		const freeRoles = ["QOTD", "ANN", "GW", "MOVIES", "Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
			"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
			"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
			"Call of Duty", "Destiny", "Psych"];
		client.channels.get("447205162436788235").fetchMessages({ limit: 100 }).then(messages => {
			console.log("feels bad man");
			messages.forEach(async function(message) {
				console.log("plz?");
				if (message.author.id === client.user.id) {
					console.log("rip");
					if (!message.reactions.has("pixeldolphin:404768960014450689"))
						await message.react("404768960014450689");
					const filter = (reaction, user) => reaction.emoji.id === "404768960014450689" && user.id !== client.user.id;
					const collector = message.createReactionCollector(filter);
					collector.on("collect", (reaction) => {
						reaction.remove(reaction.users.last());
						var member = message.guild.member(reaction.users.last());
						if (member) {
							if (member.roles.has(message.guild.roles.find("name", message.embeds[0].title).id)) {
								member.removeRole(message.guild.roles.find("name", message.embeds[0].title));
							} else {
								member.addRole(message.guild.roles.find("name", message.embeds[0].title));
							}
						}
					});
				}
			});

			if (freeRoles.difference(messages.map(message => message.embeds[0].title)).length > 0) {
				console.log("pls log this");
				freeRoles.difference(messages.map(message => message.embeds[0].title)).forEach(newItem => {
					console.log("PLZ I BEG :((");
					const newItemEmbed = new Discord.RichEmbed()
						.setTitle(newItem)
						.setColor(client.guilds.get("330913265573953536").roles.find("name", newItem).hexColor);
					client.channels.get("447205162436788235").send({ embed: newItemEmbed }).then(async function(newItemMessage) {
						console.log("im dreaming arent i?");
						await newItemMessage.react("404768960014450689");
						const filter = (reaction, user) => reaction.emoji.id === "404768960014450689" && user.id !== client.user.id;
						const collector = newItemMessage.createReactionCollector(filter);
						collector.on("collect", (reaction) => {
							reaction.remove(reaction.users.last());
							var member = newItemMessage.guild.member(reaction.users.last());
							if (member) {
								if (member.roles.has(newItemMessage.guild.roles.find("name", newItemMessage.embeds[0].title).id)) {
									member.removeRole(newItemMessage.guild.roles.find("name", newItemMessage.embeds[0].title));
								} else {
									member.addRole(newItemMessage.guild.roles.find("name", newItemMessage.embeds[0].title));
								}
							}
						});

					});
				});
			}
		});
	}
};
