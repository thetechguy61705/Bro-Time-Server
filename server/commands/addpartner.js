const Discord = require("discord.js");

module.exports = {
	id: "addpartner",
	description: "Adds a new partner in the #partners channel",
	arguments: "(title) (description) (discord invite OR thumbnail url)",
	requires: "Role: Community Manager Bro",
	load: () => {},
	execute: (call) => {
		const partnersChannel = call.message.guild.channels.find("id", "409156491640045571");
		if (call.message.member.roles.has("409153912558583818")) {
			if (call.params.readRaw()) {
				const title = call.params.readRaw().split("|")[0];
				const description = call.params.readRaw().split("|")[1].trim();
				const thumbnail = call.params.readRaw().split("|")[2].trim();
				if (!description.length > 2048) {
					call.client.fetchInvite(thumbnail).then((invite) => {
						const partnerEmbed = new Discord.RichEmbed()
							.setTitle(title)
							.setColor("#FFA500")
							.setDescription(description)
							.setThumbnail(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png`);
						partnersChannel.send(partnerEmbed).then(() => {
							call.message.reply("Successfully sent message!").catch(function() {});
							partnersChannel.send("-------------------------------------------------").catch(function() {});
						}).catch(() => {
							call.message.reply("Couldn't send the partner message in the partners channel, make sure that you have a valid discord server invite or a valid thumbnail url!")
								.catch(() => {
									call.message.author.send(`You attempted to use the \`addpartner\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
								});
						});
					}).catch(() => {
						const partnerEmbedb = new Discord.RichEmbed()
							.setTitle(title)
							.setColor("#FFA500")
							.setDescription(description)
							.setThumbnail(thumbnail);
						partnersChannel.send(partnerEmbedb).then(() => {
							call.message.reply("Successfully sent message!").catch(function() {});
							partnersChannel.send("-------------------------------------------------").catch(function() {});
						}).catch(() => {
							call.message.reply("Couldn't send the partner message in the partners channel, make sure that you have a valid discord server invite or a valid thumbnail url!")
								.catch(() => {
									call.message.author.send(`You attempted to use the \`addpartner\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
								});
						});
					});
				} else {
					call.message.reply("The description cannot be over 2048 characters!").catch(() => {
						call.message.author.send(`You attempted to use the \`addpartner\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				call.message.reply("You did not provide the necessary parameters! `!addpartner (title) (description) (discord invite OR thumbnail url)`").catch(() => {
					call.message.author.send(`You attempted to use the \`addpartner\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permission to use this command!\n`Requires: Community Manager Bro`").catch(() => {
				call.message.author.send(`You attempted to use the \`addpartner\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
