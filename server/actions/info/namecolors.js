const Discord = require("discord.js");
const EMOJI_ARRAY = ["◀", "▶"];
const NAME_COLORS = ["Black", "White", "Red", "BrightRed", "Orange", "Bronze", "Gold", "HotBrown",
	"Salmon", "Yellow", "Green", "DarkGreen", "LimeGreen", "LightGreen", "Blue", "GrayBlue",
	"Cyan", "Purple", "Indigo", "DarkViolet", "Magenta", "HotPink", "Pink", "Invisible", "Multicolored"
];

function updateEmbed(embed, guild, colorNumber) {
	return embed
		.setTitle(NAME_COLORS[colorNumber])
		.setDescription("Members: `" + guild.roles.find("name", NAME_COLORS[colorNumber]).members.size + "`" +
			"\nHex Color: `" + guild.roles.find("name", NAME_COLORS[colorNumber]).hexColor + "`")
		.setColor(guild.roles.find("name", NAME_COLORS[colorNumber]).hexColor);
}

module.exports = {
	id: "namecolors",
	aliases: ["colors"],
	run: async (call, actions, rerun, parameter) => {
		parameter = (parameter || (rerun === true)
			? await call.requestInput(0, "Invalid choice. Choices are `preview`, `specify` or `list`. Please retry. Say `cancel` to cancel the prompt.", 60000)
			: call.params.readParameter());
		if (parameter && parameter.message != null) parameter = parameter.message.content;
		if (parameter != null) {
			if (parameter.toLowerCase() === "preview") {
				var emojiNumber = 0;
				var colorEmbed = updateEmbed(new Discord.RichEmbed(), call.message.guild, emojiNumber);
				call.message.channel.send({ embed: colorEmbed }).then(async (newMessage) => {
					await newMessage.reactMultiple(EMOJI_ARRAY);
					var filter = (reaction, user) => EMOJI_ARRAY.includes(reaction.emoji.name) && user.id === call.message.author.id;
					var reactions = newMessage.createReactionCollector(filter, { time: 60000 });
					reactions.on("collect", (reaction) => {
						reaction.remove(call.message.author);
						if (reaction.emoji.name === EMOJI_ARRAY[0]) {
							emojiNumber = (emojiNumber !== 0) ? emojiNumber - 1 : NAME_COLORS.length - 1;
						} else {
							emojiNumber = (emojiNumber !== NAME_COLORS.length - 1) ? emojiNumber + 1 : 0;
						}
						colorEmbed = updateEmbed(colorEmbed, call.message.guild, emojiNumber);
						newMessage.edit({ embed: colorEmbed }).catch(() => {});
						reactions.on("end", (_, reason) => newMessage.edit("Interactive command ended: " + reason));
					});
				}).catch(() => {});
			} else if (parameter.toLowerCase() === "list") {
				call.message.channel.send({ embed: new Discord.RichEmbed().setTitle("Color Roles").setDescription("`" + NAME_COLORS.join("`\n`") + "`").setColor(0x00AE86) }).catch(() => {
					call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			} else if (parameter.toLowerCase() === "specify") {
				var newParameter = call.params.readRaw();
				if (newParameter != null && newParameter != "") {
					var specifiedColor = NAME_COLORS.map((color) => color.toLowerCase()).indexOf(newParameter.toLowerCase());
					if (specifiedColor > -1) {
						call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedColor) });
					} else {
						call.message.reply("Invalid color role specified. Please try out `!info namecolors list` and take one of those color roles. Prompt cancelled.").catch(() => {
							call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.requestInput(0, "Please specify the color role you would like to view.", 60000).then((result) => {
						var specifiedColor = NAME_COLORS.map((color) => color.toLowerCase()).indexOf(result.message.content.toLowerCase());
						if (specifiedColor > -1) {
							call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedColor) });
						} else {
							call.message.reply("Invalid color role specified. Please try out `!info namecolors list` and take one of those color roles. Prompt cancelled.").catch(() => {
								call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					}).catch(() => {});
				}
			} else if (parameter.toLowerCase() === "cancel") call.message.reply("Cancelled prompt."); else module.exports.run(call, actions, true);
		} else module.exports.run(call, actions, true);
	}
};
