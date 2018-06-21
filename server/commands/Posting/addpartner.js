const Discord = require("discord.js");

function addPartner(channel, embed, message) {
	channel.send({embed: embed }).then(() => {
		message.reply("Successfully sent message!");
		channel.send("-------------------------------------------------");
	}).catch(() => {
		message.reply("Couldn't send the partner message in the partners channel, make sure that you have a valid discord server invite or a valid thumbnail url!")
			.catch(() => {
				message.author.send(`You attempted to use the \`addpartner\` command in ${message.channel}, but I can not chat there.`);
			});
	});
}

module.exports = {
	id: "addpartner",
	description: "Adds a new partner in the #partners channel",
	paramsHelp: "(title) | (description) | (discord invite OR thumbnail url)",
	requires: "Role: Community Manager Bro",
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
					addPartner(PARTNER_CHANNEL, PARTNER_EMBED, call.message);
				}).catch(() => {
					PARTNER_EMBED.setThumbnail(THUMBNAIL);
					addPartner(PARTNER_CHANNEL, PARTNER_EMBED, call.message);
				});
			} else call.safeSend("You did not provide the necessary parameters! `!addpartner (title) (description) (discord invite OR thumbnail url)`");
		} else call.safeSend("You do not have permission to use this command! `Requires: Community Manager Bro`");
	}
};
