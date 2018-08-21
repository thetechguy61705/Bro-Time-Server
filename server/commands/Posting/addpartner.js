const Discord = require("discord.js");

function addPartner(channel, embed, call) {
	channel.send({ embed: embed }).then(() => {
		call.message.reply("Successfully sent message!");
		channel.send("-------------------------------------------------");
	}).catch(() => {
		call.safeSend("Couldn't send the partner message in the partners channel, make sure that you have a valid discord server invite or a valid thumbnail url!");
	});
}

module.exports = {
	id: "addpartner",
	description: "Adds a new partner in the #partners channel",
	paramsHelp: "(title) | (description) | (discord invite OR thumbnail url)",
	requires: "Role: Community Manager Bro",
	access: "Server",
	exec: (call) => {
		if (call.message.member.roles.has("409153912558583818")) {
			if (call.params.readRaw()) {
				var partnerChannel = call.message.guild.channels.get("409156491640045571"),
					splitArgs = call.params.readParam(true).split("|").map((arg) => arg.trim()),
					title = splitArgs[0],
					description = splitArgs[1],
					thumbnail = splitArgs[2],
					partnerEmbed = new Discord.RichEmbed()
						.setTitle(title)
						.setColor("#FFA500")
						.setDescription(description);
				call.client.fetchInvite(thumbnail).then((invite) => {
					partnerEmbed.setThumbnail(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png`);
					addPartner(partnerChannel, partnerEmbed, call);
				}).catch(() => {
					partnerEmbed.setThumbnail(partnerEmbed);
					addPartner(partnerChannel, partnerEmbed, call);
				});
			} else call.safeSend("You did not provide the necessary parameters! `!addpartner (title) (description) (discord invite OR thumbnail url)`");
		} else call.safeSend("You do not have permission to use this command! `Requires: Community Manager Bro`");
	}
};
