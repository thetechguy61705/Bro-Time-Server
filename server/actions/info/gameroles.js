const Discord = require("discord.js");
const EMOJI_ARRAY = ["◀", "▶"];
const GAMES = ["Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
	"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
	"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
	"Call of Duty", "Destiny", "Psych", "Bro Time Games"
];

function updateEmbed(embed, guild, gameNumber) {
	return embed
		.setTitle(GAMES[gameNumber])
		.setDescription("Players: `" + guild.roles.find("name", GAMES[gameNumber]).members.size + "`")
		.setColor(guild.roles.find("name", GAMES[gameNumber]).hexColor);
}

module.exports = {
	id: "gameroles",
	aliases: ["games"],
	run: async (call, actions, rerun, parameter) => {
		parameter = (parameter || (rerun === true)
			? await call.requestInput(0, "Invalid choice. Choices are `preview`, `specify` or `list`. Please retry. Say `cancel` to cancel the prompt.", 60000)
			: call.params.readParameter());
		if (parameter && parameter.message != null) parameter = parameter.message.content;
		if (parameter != null) {
			if (parameter.toLowerCase() === "preview") {
				var emojiNumber = 0;
				var gameroleEmbed = updateEmbed(new Discord.RichEmbed(), call.message.guild, emojiNumber);
				call.message.channel.send({ embed: gameroleEmbed }).then(async (newMessage) => {
					await newMessage.reactMultiple(EMOJI_ARRAY);
					var filter = (reaction, user) => EMOJI_ARRAY.includes(reaction.emoji.name) && user.id === call.message.author.id;
					var reactions = newMessage.createReactionCollector(filter, { time: 60000 });
					reactions.on("collect", (reaction) => {
						reaction.remove(call.message.author);
						if (reaction.emoji.name === EMOJI_ARRAY[0]) {
							emojiNumber = (emojiNumber !== 0) ? emojiNumber - 1 : GAMES.length - 1;
						} else {
							emojiNumber = (emojiNumber !== GAMES.length - 1) ? emojiNumber + 1 : 0;
						}
						gameroleEmbed = updateEmbed(gameroleEmbed, call.message.guild, emojiNumber);
						newMessage.edit({ embed: gameroleEmbed }).catch(() => {});
						reactions.on("end", (_, reason) => newMessage.edit("Interactive command ended: " + reason));
					});
				});
			} else if (parameter.toLowerCase() === "list") {
				call.message.channel.send({ embed: new Discord.RichEmbed().setTitle("Game Roles").setDescription("`" + GAMES.join("`\n`") + "`").setColor(0x00AE86) }).catch(() => {
					call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			} else if (parameter.toLowerCase() === "specify") {
				var newParameter = call.params.readRaw();
				if (newParameter != null && newParameter != "") {
					var specifiedGame = GAMES.map((game) => game.toLowerCase()).indexOf(newParameter.toLowerCase());
					if (specifiedGame > -1) {
						call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedGame) });
					} else {
						call.message.reply("Invalid game specified. Please try out `!info gameroles list` and take one of those games. Prompt cancelled.").catch(() => {
							call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.requestInput(0, "Please specify the game you would like to view.", 60000).then((result) => {
						var specifiedGame = GAMES.map((game) => game.toLowerCase()).indexOf(result.message.content.toLowerCase());
						if (specifiedGame > -1) {
							call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedGame) });
						} else {
							call.message.reply("Invalid game specified. Please try out `!info gameroles list` and take one of those games. Prompt cancelled.").catch(() => {
								call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					});
				}
			} else if (parameter.toLowerCase() === "cancel") call.message.reply("Cancelled prompt."); else module.exports.run(call, actions, true);
		} else module.exports.run(call, actions, true);
	}
};
