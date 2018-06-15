const Discord = require("discord.js");
const EMOJI_ARRAY = ["◀", "▶"];
const LEVEL_ROLES = ["Newbie Bro", "Junior Bro", "Cool Junior Bro", "OP Junior Bro", "Bro", "Cool Bro",
	"OP Bro", "Senior Bro", "Cool Senior Bro", "OP Senior Bro", "Epic Bro", "Cool Epic Bro", "OP Epic Bro",
	"Legendary Bro", "Cool Legendary Bro", "OP Legendary Bro", "Elite Bro", "Cool Elite Bro", "OP Elite Bro",
	"True Bro"
];
const LEVELS = [ "0", "1", "5", "10", "11", "15", "20", "21", "25", "30", "31", "35", "40", "41", "45", "50", "51", "55", "60", "61" ];

function updateEmbed(embed, guild, levelNumber) {
	return embed
		.setTitle(LEVEL_ROLES[levelNumber])
		.setDescription("Members: `" + guild.roles.find("name", LEVEL_ROLES[levelNumber]).members.size + "`\nObtain: " + "`level: " + LEVELS[levelNumber] + "`")
		.setColor(guild.roles.find("name", LEVEL_ROLES[levelNumber]).hexColor);
}

module.exports = {
	id: "levelroles",
	aliases: ["levels"],
	run: async (call, actions, rerun, parameter) => {
		parameter = (parameter || (rerun === true)
			? await call.requestInput(0, "Invalid choice. Choices are `preview`, `specify` or `list`. Please retry. Say `cancel` to cancel the prompt.", 60000)
			: call.params.readParameter());
		if (parameter && parameter.message != null) parameter = parameter.message.content;
		if (parameter != null) {
			if (parameter.toLowerCase() === "preview") {
				var emojiNumber = 0;
				var levelEmbed = updateEmbed(new Discord.RichEmbed(), call.message.guild, emojiNumber);
				call.message.channel.send({ embed: levelEmbed }).then(async (newMessage) => {
					await newMessage.reactMultiple(EMOJI_ARRAY);
					var filter = (reaction, user) => EMOJI_ARRAY.includes(reaction.emoji.name) && user.id === call.message.author.id;
					var reactions = newMessage.createReactionCollector(filter, { time: 60000 });
					reactions.on("collect", (reaction) => {
						reaction.remove(call.message.author);
						if (reaction.emoji.name === EMOJI_ARRAY[0]) {
							emojiNumber = (emojiNumber !== 0) ? emojiNumber - 1 : LEVEL_ROLES.length - 1;
						} else {
							emojiNumber = (emojiNumber !== LEVEL_ROLES.length - 1) ? emojiNumber + 1 : 0;
						}
						levelEmbed = updateEmbed(levelEmbed, call.message.guild, emojiNumber);
						newMessage.edit({ embed: levelEmbed });
						reactions.on("end", (_, reason) => newMessage.edit("Interactive command ended: " + reason));
					});
				});
			} else if (parameter.toLowerCase() === "list") {
				call.message.channel.send({ embed: new Discord.RichEmbed().setTitle("Level Roles").setDescription("`" + LEVEL_ROLES.join("`\n`") + "`").setColor(0x00AE86) }).catch(() => {
					call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`);
				});
			} else if (parameter.toLowerCase() === "specify") {
				var newParameter = call.params.readRaw();
				if (newParameter != null && newParameter != "") {
					var specifiedLevel = LEVEL_ROLES.map((level) => level.toLowerCase()).indexOf(newParameter.toLowerCase());
					if (specifiedLevel > -1) {
						call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedLevel) });
					} else {
						call.message.reply("Invalid level specified. Please try out `!info levelroles list` and take one of those levels. Prompt cancelled.").catch(() => {
							call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`);
						});
					}
				} else {
					call.requestInput(0, "Please specify the level you would like to view.", 60000).then((result) => {
						var specifiedLevel = LEVEL_ROLES.map((level) => level.toLowerCase()).indexOf(result.message.content.toLowerCase());
						if (specifiedLevel > -1) {
							call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedLevel) });
						} else {
							call.message.reply("Invalid level specified. Please try out `!info levelroles list` and take one of those levels. Prompt cancelled.").catch(() => {
								call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`);
							});
						}
					});
				}
			} else if (parameter.toLowerCase() === "cancel") call.message.reply("Cancelled prompt."); else module.exports.run(call, actions, true);
		} else module.exports.run(call, actions, true);
	}
};
