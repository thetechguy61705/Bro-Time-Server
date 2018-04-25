const Discord = require("discord.js");

module.exports = {
	id: "members",
	description: "Gets members from a role or from a guild.",
	arguments: "(role)",
	load: () => {},
	execute: (call) => {
		var memberEmbed = new Discord.RichEmbed().setColor("ORANGE");
		var members;
		var content = call.params.readRaw();
		var parameterOne = content.split(" ")[0];
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
		if (membersLength > 750) {
			membersLength = 0
			membersToSend = members.substring(membersLength, membersLength+750).split("\n");
			membersToSend.pop();
			memberEmbed.setDescription(membersToSend.join("\n"));
			call.message.channel.send({ embed: memberEmbed }).then(async function(sentEmbed) {
				const emojiArray = ["◀", "▶"];
				const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === call.message.author.id;
				await sentEmbed.react(emojiArray[0]);
				await sentEmbed.react(emojiArray[1]);
				var reactions = sentEmbed.createReactionCollector(filter, { time: 120000 });
				reactions.on("collect", async function(reaction) {
					await reaction.remove(call.message.author);
					if (reaction.emoji.name === "◀") {
						if (membersLength > 0) {
							membersLength = membersLength - 750;
							membersToSend = members.substring(membersLength, membersLength+750).split("\n");
							membersToSend.pop();
							if (call.client.users.find(u => membersToSend[0] === u.toString()) === null) membersToSend.shift();
						}
					} else {
						if (membersLength < members.length) {
							membersLength = membersLength + 750;
							membersToSend = members.substring(membersLength, membersLength+750).split("\n");
							membersToSend.pop();
							if (call.client.users.find(u => membersToSend[0] === u.toString()) === null) membersToSend.shift();
						}
					}
					memberEmbed = new Discord.RichEmbed().setDescription(membersToSend.join("\n")).setColor("ORANGE");
					if (content !== "") memberEmbed.setTitle(`Users in ${call.message.guild.roles.find(r => r.name.toLowerCase().startsWith(content.toLowerCase())).name}`);
					if (content === "") memberEmbed.setTitle("Users");
					sentEmbed.edit(memberEmbed)
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
	}
};
