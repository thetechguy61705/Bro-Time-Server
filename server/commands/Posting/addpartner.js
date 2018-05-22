const Discord = require("discord.js");

function addPartner(channel, embed, message) {
	channel.send({embed: embed }).then(() => {
		message.reply("Successfully sent message!").catch(function() {});
		channel.send("-------------------------------------------------").catch(function() {});
	}).catch(() => {
		message.reply("Couldn't send the partner message in the partners channel, make sure that you have a valid discord server invite or a valid thumbnail url!")
			.catch(() => {
				message.author.send(`You attempted to use the \`addpartner\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
			});
	});
}

module.exports = {
	id: "addpartner",
	description: "Adds a new partner in the #partners channel",
	arguments: "(title) | (description) | (discord invite OR thumbnail url)",
	requires: "Role: Community Manager Bro",
	execute: (call) => {
		const partnersChannel = call.message.guild.channels.get("409156491640045571");
		if (call.message.member.roles.has("409153912558583818")) {
			if (call.params.readRaw()) {
				const title = call.params.readRaw().split("|")[0];
				const description = call.params.readRaw().split("|")[1].trim();
				const thumbnail = call.params.readRaw().split("|")[2].trim();
				var partnerEmbed = new Discord.RichEmbed()
					.setTitle(title)
					.setColor("#FFA500")
					.setDescription(description);
				call.client.fetchInvite(thumbnail).then((invite) => {
					partnerEmbed.setThumbnail(invite.guild.iconURL);
					addPartner(partnersChannel, partnerEmbed, call.message);
				}).catch(() => {
					partnerEmbed.setThumbnail(thumbnail);
					addPartner(partnersChannel, partnerEmbed, call.message);
				});
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
