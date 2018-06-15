const Discord = require("discord.js");
const EMOJI_ARRAY = ["◀", "▶"];
const OBTAINABLE_ROLES = ["Story Teller", "Dolphin", "Meme Master", "Inviter", "Pro Inviter", "Cuber", "Artist", "Partner",
	"Contributor", "Supporter", "Bug Smasher"
];
const DESCRIPTIONS = ["Get part of your story on the starboard.",
	"Tell cj your knowledge about dolphin’s dark deeds and he shall decide if you are worthy of the role.",
	"Get one of your memes on the starboard.",
	"Invite 5 people to this server", "Invite 10 people to this server", "Be able to solve a 3x3 Rubik’s cube in less than 2 minutes.",
	"Get one of your art pieces on the starboard.", "Be the owner of a discord server partnered with us.", "Contribute to the server or assets relating to it",
	"Tip any amount, payment instructions in !info perks",
	"Report an unknown bug to a developer of Bro Bot"
];

function updateEmbed(embed, guild, htgrNumber) {
	return embed
		.setTitle(OBTAINABLE_ROLES[htgrNumber])
		.setDescription("Members: `" + guild.roles.find("name", OBTAINABLE_ROLES[htgrNumber]).members.size + "`\nObtain: `" + DESCRIPTIONS[htgrNumber] + "`")
		.setColor(guild.roles.find("name", OBTAINABLE_ROLES[htgrNumber]).hexColor);
}

module.exports = {
	id: "howtogetrole",
	aliases: ["htgr"],
	run: async (call, actions, rerun) => {
		var parameter = (rerun === true)
			? await call.requestInput(0, "Invalid choice. Choices are `preview`, `specify` or `list`. Please retry. Say `cancel` to cancel the prompt.")
			: call.params.readParameter();
		if (parameter && parameter.message != null) parameter = parameter.message.content;
		if (parameter != null) {
			if (parameter.toLowerCase() === "preview") {
				var emojiNumber = 0;
				var htgrEmbed = updateEmbed(new Discord.RichEmbed(), call.message.guild, emojiNumber);
				call.message.channel.send({ embed: htgrEmbed }).then(async (newMessage) => {
					await newMessage.reactMultiple(EMOJI_ARRAY);
					var filter = (reaction, user) => EMOJI_ARRAY.includes(reaction.emoji.name) && user.id === call.message.author.id;
					var reactions = newMessage.createReactionCollector(filter, { time: 60000 });
					reactions.on("collect", (reaction) => {
						reaction.remove(call.message.author);
						if (reaction.emoji.name === EMOJI_ARRAY[0]) {
							emojiNumber = (emojiNumber !== 0) ? emojiNumber - 1 : OBTAINABLE_ROLES.length - 1;
						} else {
							emojiNumber = (emojiNumber !== OBTAINABLE_ROLES.length - 1) ? emojiNumber + 1 : 0;
						}
						htgrEmbed = updateEmbed(htgrEmbed, call.message.guild, emojiNumber);
						newMessage.edit({ embed: htgrEmbed }).catch(() => {});
					});
					reactions.on("end", (_, reason) => newMessage.edit("Interactive command ended: " + reason));
				}).catch(() => {});
			} else if (parameter.toLowerCase() === "list") {
				call.message.channel.send({ embed: new Discord.RichEmbed().setTitle("Obtainable Roles").setDescription("`" + OBTAINABLE_ROLES.join("`\n`") + "`").setColor(0x00AE86) }).catch(() => {
					call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			} else if (parameter.toLowerCase() === "specify") {
				var newParameter = call.params.readRaw();
				if (newParameter != null && newParameter != "") {
					var specifiedHTGR = OBTAINABLE_ROLES.map((role) => role.toLowerCase()).indexOf(newParameter.toLowerCase());
					if (specifiedHTGR > -1) {
						call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedHTGR) });
					} else {
						call.message.reply("Invalid obtainable role specified. Please try out `!info htgr list` and take one of those roles. Prompt cancelled.").catch(() => {
							call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.requestInput(0, "Please specify the obtainable role you would like to view.", 60000).then((result) => {
						var specifiedHTGR = OBTAINABLE_ROLES.map((role) => role.toLowerCase()).indexOf(result.message.content.toLowerCase());
						if (specifiedHTGR > -1) {
							call.message.channel.send({ embed: updateEmbed(new Discord.RichEmbed, call.message.guild, specifiedHTGR) });
						} else {
							call.message.reply("Invalid obtainable role specified. Please try out `!info htgr list` and take one of those roles. Prompt cancelled.").catch(() => {
								call.message.author.send(`You attempted to use the \`info\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					}).catch(() => {});
				}
			} else if (parameter.toLowerCase() === "cancel") call.message.reply("Cancelled prompt."); else module.exports.run(call, actions, true);
		} else module.exports.run(call, actions, true);
	}
};
