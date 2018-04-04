var excludedUsers = ["140163987500302336", "320666152693006344", "391878815263096833"];

module.exports = {
	exec: (client) => {
		var testGuild = client.guilds.get("430096406275948554");
		var noParentChannels = testGuild.channels.filter(c => c.parent === null && c.type !== "category")
		var realGuild = client.guilds.get("330913265573953536");
		client.on("message", (message) => {
			if (message.channel.type === "text") {
				if (!excludedUsers.includes(message.author.id)) {
					if(message.guild.id === realGuild.id) {
						testGuild.channels.find("name", message.channel.name).send(`**${message.author.tag}** (${message.author.id})\n\`\`\`${message.content} \`\`\``);
					}
				} else {
					if(message.guild.id === realGuild.id) {
						testGuild.channels.find("name", message.channel.name).send("**USER_TAG** (USER_ID)\n```MESSAGE CONTENT COULD NOT SEND: USER EXCLUDED```");
					}
				}
			}
		});

		client.on("guildMemberAdd", (member) => {
			realGuild.fetchMember(member.user).then(function(user) {
				if (member.guild.id === testGuild.id) {
					testGuild.fetchMember(member.user).then(function(testMember) {
						user.roles.forEach(function(role) {
							if (role.name !== "@everyone") {
								testMember.addRole(testGuild.roles.find("name", role.name));
							}
						});
					});
				}
			}).catch(function(){});
		});

		client.on("guildMemberUpdate", (oldMember, newMember) => {
			testGuild.fetchMember(oldMember.user).then(function(user) {
				if (user != undefined) {
					if (oldMember.guild.id === realGuild.id) {
						oldMember.roles.forEach(function(role) {
							if (!newMember.roles.has(role.id)) {
								user.removeRole(testGuild.roles.find("name", role.name));
							}
						});
						newMember.roles.forEach(function(role) {
							if (!oldMember.roles.has(role.id)) {
								user.addRole(testGuild.roles.find("name", role.name));
							}
						});
					}
				}
			}).catch(function(){});
		});

		client.on("channelCreate", (channel) => {
			if (channel.type !== "dm" && channel.type !== "group") {
				if(channel.guild.id === realGuild.id) {
					testGuild.createChannel(channel.name, channel.type).then(function(newChannel) {
						newChannel.setParent(testGuild.channels.find("name", newChannel.parent.name));
					});
				}
			}
		});

		client.on("channelDelete", (channel) => {
			if (channel.type !== "dm" && channel.type !== "group") {
				if(channel.guild.id === realGuild.id) {
					testGuild.channels.find("name", channel.name).delete();
				}
			}
		});

		client.on("channelUpdate", (oldChannel, newChannel) => {
			if (oldChannel.type !== "dm" && oldChannel.type !== "group") {
				if(oldChannel.guild.id === realGuild.id) {
					testGuild.channels.find("name", oldChannel.name).setName(newChannel.name).then(() => {
						if(oldChannel.type === "text") testGuild.channels.find("name", newChannel.name).setTopic(newChannel.topic);
						if (oldChannel.type === "text" || oldChannel.type === "voice") testGuild.channels.find("name", newChannel.name)
							.setPosition(newChannel.position-noParentChannels.size);
					});
				}
			}
		});

		client.on("guildBanAdd", (guild, user) => {
			if(guild.id === realGuild.id) {
				testGuild.ban(user);
			}
		});

		client.on("guildBanRemove", (guild, user) => {
			if(guild.id === realGuild.id) {
				testGuild.unban(user);
			}
		});
	}
};
