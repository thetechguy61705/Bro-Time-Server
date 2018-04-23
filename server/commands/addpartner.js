const Discord = require("discord.js");

module.exports = {
	id: "addpartner",
	load: () => {},
	execute: (call) => {
		var CommunityManagerBro = call.message.guild.roles.find(`id`, `409153912558583818`);
		let PartnersChannel = call.message.guild.channels.find(`id`, `409156491640045571`);
		if(call.message.member.roles.has(CommunityManagerBro)) {
		var Title = call.params.readRaw().split("|")[0];
		var Description = call.params.readRaw().split("|")[1];
		var Thumbnail = call.params.readRaw().split("|")[2];
		const PartnerEmbed = new Discord.RichEmbed()
		.setTitle(Title)
		.setColor("#FFA500")
		.setDescription(Description)
		.setThumbnail(Thumbnail);
		PartnersChannel(PartnerEmbed).catch((e) => {
			call.message.reply(`Couldn't send the partner message in the partners channel!\n\`${e}\``);
		});
		}
	}
}
