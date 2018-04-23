const Discord = require("discord.js");

module.exports = {
	id: "addpartner",
	load: () => {},
	execute: (call) => {
		let PartnersChannel = call.message.guild.channels.find("id", "409156491640045571");
		if(call.message.member.roles.has("409153912558583818")) {
			if(call.params.readRaw()) {
				var Title = call.params.readRaw().split(" |")[0];
				if(!Title) call.message.reply("You did not provide the necessary parameters! `!addpartner (title) | (description) | (thumbnail URL)`");
				var Description = call.params.readRaw().split(" |")[1].slice(1);
				if(!Description) call.message.reply("You did not provide the necessary parameters! `!addpartner (title) | (description) | (thumbnail URL)`");
				var Thumbnail = call.message.content.slice(18+Title.length+Description.length);
				if(!Thumbnail) call.message.reply("You did not provide the necessary parameters! `!addpartner (title) | (description) | (thumbnail URL)`");
				const PartnerEmbed = new Discord.RichEmbed()
					.setTitle(Title)
					.setColor("#FFA500")
					.setDescription(Description)
					.setThumbnail(Thumbnail);
				PartnersChannel.send(PartnerEmbed).then(() => {
					call.message.reply("Successfully sent message!");
				}).catch((e) => {
					call.message.reply("Couldn't send the partner message in the partners channel!");
				});
			} else {
				call.message.reply("You do not have permission to use this command!\n`Requires: Community Manager Bro`");
			} else {
				call.message.reply("You did not provide the necessary parameters! `!addpartner (title) | (description) | (thumbnail URL)`");
			}
		}
	}
};
