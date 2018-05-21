const Discord = require("discord.js");

const freeRoles = ["QOTD", "ANN", "GW", "MOVIES", "Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
	"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
	"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
	"Call of Duty", "Destiny", "Psych"];

module.exports = {
	exec: (client) => {
		var channel = client.channels.map(c => c.name);
		console.log(channel);
		if (false) {
			channel.fetchMessages({ limit: freeRoles.length }).then(messages => {
				console.log("feels bad man");
				messages.forEach(async function(message) {
					if (!message.reactions.has("pixeldolphin:404768960014450689"))
						await message.react("404768960014450689");
				});

				if (freeRoles.difference(messages.map(message => message.embeds[0].title)).length > 0) {
					console.log("pls log this");
					freeRoles.difference(messages.map(message => message.embeds[0].title)).forEach(newItem => {
						console.log("PLZ I BEG :((");
						const newItemEmbed = new Discord.RichEmbed()
							.setTitle(newItem)
							.setColor(client.guilds.get("330913265573953536").roles.find("name", newItem).hexColor);
						client.channels.get("447205162436788235").send({ embed: newItemEmbed }).then(newItemMessage => {
							messages.set(newItemMessage.id, newItemMessage);
						});
					});
				}

				client.on("messageReactionAdd", (reaction) => {
					if (messages.some(msg => msg.id === reaction.message.id) && reaction.emoji.id === "404768960014450689") {
						reaction.remove(reaction.users.last());
						var member = channel.guild.member(reaction.users.last());
						if (member) {
							if (member.roles.has(channel.guild.roles.find("name", reaction.message.embeds[0].title).id)) {
								member.removeRole(channel.guild.roles.find("name", reaction.message.embeds[0].title));
							} else {
								member.addRole(channel.guild.roles.find("name", reaction.message.embeds[0].title));
							}
						}
					}
				});
			});
		} else console.log("failed rip.");
	}
};
