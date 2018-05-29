const Discord = require("discord.js");
const fs = require("fs");
module.exports = {
	id: "guildnames",
	exec: async (client) => {
		var brotime = client.guilds.get("330913265573953536");
		var oldinvites;
		if (client.user.id === "393532251398209536") {
			oldinvites = await brotime.fetchInvites();
		}
		var hangoutChannel;
		var newinvites;
		client.on("guildMemberAdd", async (member) => {
			newinvites = client.fetchInvites().array();
			var inviteused = new Promise(function(resolve) {
				oldinvites.forEach((oldinvite) => {
					if(oldinvite.uses < newinvites[oldinvites.indexOf(oldinvite)]) {
						resolve(oldinvite);
					}
				});
			});
			var inviter;
			if(inviteused.code === "rjM8wdZ") inviter = "The Main";
			if(!inviteused.code === "rjM8wdZ") inviter = `${inviteused.inviter.tag}'s`;
			if (client.user.id === "393532251398209536") {
				if (member.guild.id === "330913265573953536") {
					hangoutChannel = member.guild.channels.find("name", "hangout");
					const roles = [
						member.guild.roles.find("name", "ANN"),
						member.guild.roles.find("name", "Newbie Bro"),
						member.guild.roles.find("name", "White")
					];
					if (!member.user.bot) {
						member.addRoles(roles).catch(function() {});
						const welcomeMessage = new Discord.RichEmbed()
							.setTitle("Welcome")
							.setColor("#FFA500")
							.setDescription(`Welcome to Bro Time ${member.user}! Have a good time here!`)
							.setFooter(`Bro Time is now at ${member.guild.memberCount} members! || Joined through ${inviter.toLowerCase()} invite`);
						hangoutChannel.send({ embed: welcomeMessage }).then(() => {
							fs.readFile(__dirname + "/./../info/welcomemsg.md", (err, data) => {
								if (err) {
									throw err;
								} else {
									member.user.send(data.toString("utf8")).catch(function() {});
								}
							});
						}).catch(function() {});
						const logMessage = new Discord.RichEmbed()
							.setTitle("New Member")
							.addField("User Tag", member.tag)
							.addField("User Id", member.id)
							.addField("Joined Via", `${inviter} Invite`);
						var logchannel = client.channels.get("396096204720701440");
						logchannel.send(logMessage);
						oldinvites = await brotime.fetchInvites();
					} else member.addRole(member.guild.roles.find("name", "Bots")).catch(function() {});
				}
			}
		});

		client.on("guildMemberRemove", (member) => {
			if (client.user.id === "393532251398209536") {
				if (member.guild.id === "330913265573953536") {
					hangoutChannel = member.guild.channels.find("name", "hangout");
					if (!member.user.bot) {
						const goodbyeMessage = new Discord.RichEmbed()
							.setTitle("Goodbye")
							.setColor("#0000ff")
							.setDescription(`Sad to see you leave ${member.user}.`);
						hangoutChannel.send({ embed: goodbyeMessage }).catch(function() {});
					}
				}
			}
		});
	}
};
