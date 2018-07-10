const { RichEmbed } = require("discord.js");
const fs = require("fs");

module.exports = {
	id: "guildnames",
	needs: "330913265573953536",
	exec: (client) => {
		var hangoutChannel;
		client.on("guildMemberAdd", (member) => {
			if (client.user.id === "393532251398209536") {
				if (member.guild.id === "330913265573953536") {
					hangoutChannel = member.guild.channels.find("name", "hangout");
					const roles = [
						member.guild.roles.find("name", "ANN"),
						member.guild.roles.find("name", "White")
					];
					if (!member.user.bot) {
						member.addRoles(roles);
						const welcomeMessage = new RichEmbed()
							.setTitle("Welcome")
							.setColor("#FFA500")
							.setDescription(`Welcome to Bro Time ${member} (${member.user.tag})! Have a good time here!`)
							.setFooter(`Bro Time is now at ${member.guild.memberCount} members!`);
						hangoutChannel.send({ embed: welcomeMessage }).then(() => {
							fs.readFile(__dirname + "/./../info/welcomemsg.md", (err, data) => {
								if (err) {
									throw err;
								} else {
									member.user.send(data.toString("utf8"));
								}
							});
						});
					} else member.addRole(member.guild.roles.find("name", "Bots"));
				}
			}
		});

		client.on("guildMemberRemove", (member) => {
			if (client.user.id === "393532251398209536") {
				if (member.guild.id === "330913265573953536") {
					hangoutChannel = member.guild.channels.find("name", "hangout");
					if (!member.user.bot) {
						const goodbyeMessage = new RichEmbed()
							.setTitle("Goodbye")
							.setColor("#0000ff")
							.setDescription(`Sad to see you leave ${member} (${member.user.tag}).`);
						hangoutChannel.send({ embed: goodbyeMessage });
					}
				}
			}
		});
	}
};
