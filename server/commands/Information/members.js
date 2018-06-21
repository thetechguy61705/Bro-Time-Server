const Discord = require("discord.js");
const EMOJI_ARRAY = ["◀", "▶"];

module.exports = {
	id: "members",
	description: "Gets members from a role or from a guild.",
	paramsHelp: "[role]",
	execute: (call) => {
		var memberEmbed = new Discord.RichEmbed().setColor("ORANGE");
		var members;
		var content = call.params.readRaw();
		if (call.message.guild.roles.find((r) => r.name.toLowerCase().startsWith(content.toLowerCase()))) {
			if (content !== "") {
				members = call.message.guild.roles.find((r) => r.name.toLowerCase().startsWith(content.toLowerCase())).members.map((m) => m.user.tag).sort()
					.map((u) => call.client.users.find((r) => r.tag === u).toString()).join("\n");
				memberEmbed.setTitle(`Users in ${call.message.guild.roles.find((r) => r.name.toLowerCase().startsWith(content.toLowerCase())).name}`);
			} else {
				members = call.message.guild.members.map((m) => m.user.tag).sort()
					.map((u) => call.client.users.find((r) => r.tag === u).toString()).join("\n");
				memberEmbed.setTitle("Users");
			}
			var membersLength = members.length;
			var membersToSend;
			var page = 1;
			if (members.split("\n").length > 20) {
				membersLength = 0;
				membersToSend = members.split("\n").slice(membersLength, membersLength + 20);
				var totalPages = 20 - (members.split("\n").length % 20);
				if (totalPages === 20) {
					totalPages = members.split("\n").length / 20;
				} else {
					totalPages = (members.split("\n").length + (20 - (members.split("\n").length % 20)));
					totalPages /= 20;
				}
				memberEmbed.setDescription(membersToSend.join("\n")).setFooter(`Page ${page}/${totalPages} -`).setDefaultFooter(call.message.author);
				call.message.channel.send({ embed: memberEmbed }).then(async function(sentEmbed) {
					await sentEmbed.reactMultiple(EMOJI_ARRAY);
					const FILTER = (reaction, user) => EMOJI_ARRAY.includes(reaction.emoji.name) && user.id === call.message.author.id;
					var reactions = sentEmbed.createReactionCollector(FILTER, { time: 120000 });
					reactions.on("collect", async function(reaction) {
						await reaction.remove(call.message.author);
						if (reaction.emoji.name === "◀") {
							if (page !== 1) {
								page -= 1;
								membersLength -= 20;
								membersToSend = members.split("\n").slice(membersLength, membersLength+20);
							}
						} else {
							if (page !== totalPages) {
								page += 1;
								membersLength += 20;
								membersToSend = members.split("\n").slice(membersLength, membersLength+20);
							}
						}

						memberEmbed = new Discord.RichEmbed()
							.setDescription(membersToSend.join("\n"))
							.setColor("ORANGE")
							.setFooter(`Page ${page}/${totalPages} -`)
							.setDefaultFooter(call.message.author);
						memberEmbed.setTitle((content !== "") ? `Users in ${call.message.guild.roles.find((r) => r.name.toLowerCase().startsWith(content.toLowerCase())).name}` : "Users");
						sentEmbed.edit({ embed: memberEmbed });
					});
					reactions.on("end", () => sentEmbed.edit("Interactive command ended: 2 minutes passed."));
				}).catch(() => {
					call.safeSend("There was an error while trying to send this embed.");
				});
			} else {
				memberEmbed.setDescription(members);
				call.safeSend({ embed: memberEmbed }, call.message, false);
			}
		} else call.safeSend("Please specify a valid role, or supply no parameter for everyone in this server.");
	}
};
