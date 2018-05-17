const Discord = require("discord.js");

module.exports = {
	id: "members",
	description: "Gets members from a role or from a guild.",
	arguments: "(role)",
	execute: (call) => {
		var memberEmbed = new Discord.RichEmbed().setColor("ORANGE");
		var members;
		var content = call.params.readRaw();
		if (call.message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase()))) {
			if (content !== "") {
				members = call.message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase())).members.map(m => m.user.tag).sort()
					.map(u => call.client.users.find(r => r.tag === u).toString()).join("\n");
				memberEmbed.setTitle(`Users in ${call.message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase())).name}`);
			} else {
				members = call.message.guild.members.map(m => m.user.tag).sort()
					.map(u => call.client.users.find(r => r.tag === u).toString()).join("\n");
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
					totalPages = totalPages / 20;
				}
				memberEmbed.setDescription(membersToSend.join("\n")).setFooter(`Page ${page}/${totalPages}`);
				call.message.channel.send({ embed: memberEmbed }).then(async function(sentEmbed) {
					const emojiArray = ["◀", "▶"];
					const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === call.message.author.id;
					await sentEmbed.react(emojiArray[0]).catch(function() {});
					await sentEmbed.react(emojiArray[1]).catch(function() {});
					var reactions = sentEmbed.createReactionCollector(filter, { time: 120000 });
					reactions.on("collect", async function(reaction) {
						await reaction.remove(call.message.author);
						if (reaction.emoji.name === "◀") {
							if (page !== 1) {
								page = page - 1;
								membersLength = membersLength - 20;
								membersToSend = members.split("\n").slice(membersLength, membersLength+20);
							}
						} else {
							if (page !== totalPages) {
								page = page+1;
								membersLength = membersLength + 20;
								membersToSend = members.split("\n").slice(membersLength, membersLength+20);
							}
						}

						memberEmbed = new Discord.RichEmbed().setDescription(membersToSend.join("\n")).setColor("ORANGE")
							.setFooter(`Page ${page}/${totalPages}`);
						if (content !== "") memberEmbed.setTitle(`Users in ${call.message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase())).name}`);
						if (content === "") memberEmbed.setTitle("Users");
						sentEmbed.edit(memberEmbed).catch(function() {});
					});
					reactions.on("end", () => sentEmbed.edit("Interactive command ended: 2 minutes passed."));
				}).catch(() => {
					call.message.reply("There was an error while trying to send this embed.").catch(() => {
						call.message.author.send(`You attempted to run the \`members\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				});
			} else {
				memberEmbed.setDescription(members);
				call.message.channel.send({ embed: memberEmbed }).catch(() => {
					call.message.reply("There was an error while trying to send this embed.").catch(() => {
						call.message.author.send(`You attempted to run the \`members\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				});
			}
		} else {
			call.message.reply("Please specify a valid role, or supply no parameter for everyone in this server.").catch(() => {
				call.message.author.send(`You attempted to run the \`members\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
