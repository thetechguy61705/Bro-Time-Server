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
	execute: (call) => {
		if (call.message.member.roles.has("409153912558583818")) {
			if (call.params.readRaw()) {
				const PARTNER_CHANNEL = call.message.guild.channels.get("409156491640045571"),
					SPLIT_ARGS = call.params.readRaw().split("|").map((arg) => arg.trim()),
					TITLE = SPLIT_ARGS[0],
					DESCRIPTION = SPLIT_ARGS[1],
					THUMBNAIL = SPLIT_ARGS[2],
					PARTNER_EMBED = new Discord.RichEmbed()
						.setTitle(TITLE)
						.setColor("#FFA500")
						.setDescription(DESCRIPTION);
				call.client.fetchInvite(THUMBNAIL).then((invite) => {
					PARTNER_EMBED.setThumbnail(invite.guild.iconURL);
					addPartner(PARTNER_CHANNEL, PARTNER_EMBED, call);
				}).catch(() => {
					PARTNER_EMBED.setThumbnail(THUMBNAIL);
					addPartner(PARTNER_CHANNEL, PARTNER_EMBED, call);
				});
			} else call.safeSend("You did not provide the necessary parameters! `!addpartner (title) (description) (discord invite OR thumbnail url)`");
		} else call.safeSend("You do not have permission to use this command! `Requires: Community Manager Bro`");
	}
};
