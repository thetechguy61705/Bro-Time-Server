module.exports = {
	id: "servericon",
	load: () => {},
	execute: (call) => {
		if(call.params.readRaw()) {
			var unfetchedinvite = call.params.readRaw();
			call.client.fetchInvite(unfetchedinvite).then((invite) => {
				call.message.reply(`https://cdn.discordapp.com/icons/${invite.guild.id}/${invite.guild.icon}.png`);
			}).catch(() => {
				call.message.author.send("You did not provide a valid invite!");
			});
		} else {
			call.message.reply("You did not provide the necessary parameter(s)! `!servericon (invite)`");
		}
	}
};
