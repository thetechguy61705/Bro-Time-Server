const Discord = require("discord.js");
var excludedUsers = ["140163987500302336", "320666152693006344", "391878815263096833"];
var partiallyExcludedUsers = ["293060399106883584"];

module.exports = {
	exec: (client) => {
		var testGuild = client.guilds.get("430096406275948554");
		var realGuild = client.guilds.get("330913265573953536");
		console.log(realGuild);
		client.on("message", (message) => {
			if (realGuild == undefined) return;
			if (message.channel.type !== "dm") {
				if (message.guild.id === realGuild.id) {
					var users = message.mentions.users.map(u => `<@${u.id}>`);
					var channels = message.mentions.channels.map(c => `<#${c.id}>`);
					var roles = message.mentions.roles.map(r => `<@&${testGuild.roles.find("name", r.name).id}>`);
					var messageMentions = users.concat(channels, roles);
					var everyone = message.mentions.everyone;
					if (everyone === true) {
						if (users.length === 0 && channels.length === 0 && roles.length === 0) {
							everyone = "@everyone or @here";
						} else {
							everyone = ", @everyone or @here";
						}
					} else {
						everyone = "";
					}
					const embed = new Discord.RichEmbed()
						.setTitle("Mentions")
						.setDescription(messageMentions.join(", ") + everyone);
					var messageAttachments = "";
					if (message.attachments.size !== 0) {
						messageAttachments = message.attachments.map(attachment => attachment.url).join("\n");
					}
					if (message.channel.type === "text") {
						if (excludedUsers.includes(message.author.id)) {
							if (message.guild.id === realGuild.id) {
								testGuild.channels.find("name", message.channel.name).send("```USER_TAG (USER_ID)```\nMESSAGE CONTENT COULD NOT SEND: USER EXCLUDED");
							}
						} else if (partiallyExcludedUsers.includes(message.author.id)) {
							if (message.guild.id === realGuild.id) {
								testGuild.channels.find("name", message.channel.name)
									.send(`\`\`\`${message.author.tag} (${message.author.id})\`\`\`\nMESSAGE CONTENT COULD NOT SEND: USER EXCLUDED`);
							}
						} else {
							if (message.guild.id === realGuild.id) {
								testGuild.channels.find("name", message.channel.name)
									.send(`\`\`\`${message.author.tag} (${message.author.id})\`\`\`\n${message.cleanContent}\n${messageAttachments}`, {
										embed: embed
									});
							}
						}
					}
				}
			}
		});

		client.on("guildMemberAdd", (member) => {
			if (realGuild == undefined) return;
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
			}).catch(function() {});
		});

		client.on("guildMemberUpdate", (oldMember, newMember) => {
			if (realGuild == undefined) return;
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
			}).catch(function() {});
		});

		client.on("channelCreate", (channel) => {
			if (realGuild == undefined) return;
			if (channel.type !== "dm" && channel.type !== "group") {
				if (channel.guild.id === realGuild.id) {
					testGuild.createChannel(channel.name, channel.type).then(function(newChannel) {
						newChannel.setParent(testGuild.channels.find("name", newChannel.parent.name));
					});
				}
			}
		});

		client.on("channelDelete", (channel) => {
			if (realGuild == undefined) return;
			if (channel.type !== "dm" && channel.type !== "group") {
				if (channel.guild.id === realGuild.id) {
					testGuild.channels.find("name", channel.name).delete();
				}
			}
		});

		client.on("channelUpdate", (oldChannel, newChannel) => {
			if (realGuild == undefined) return;
			//var noParentChannels = testGuild.channels.filter(c => c.parent === null && c.type !== "category");
			if (oldChannel.type !== "dm" && oldChannel.type !== "group") {
				if (oldChannel.guild.id === realGuild.id) {
					if (oldChannel.type !== "category") {
						testGuild.channels.find("name", oldChannel.name).setName(newChannel.name).then(() => {
							testGuild.channels.find("name", newChannel.name)
								.setParent(testGuild.channels.find("name", newChannel.parent.name)).then(() => {
									testGuild.channels.find("name", newChannel.name)
										.setPosition(oldChannel.position - newChannel.position);
								});
						});
					}
					if (oldChannel.type === "text" || oldChannel.type === "voice") {
						if (oldChannel.type === "text") {
							if (oldChannel.topic !== newChannel.topic) {
								testGuild.channels.find("name", newChannel.name).setTopic(newChannel.topic);
							}
						}
					}
				}
			}
		});

		client.on("guildBanAdd", (guild, user) => {
			if (realGuild == undefined) return;
			if (guild.id === realGuild.id) {
				testGuild.ban(user);
			}
		});

		client.on("guildBanRemove", (guild, user) => {
			if (realGuild == undefined) return;
			if (guild.id === realGuild.id) {
				testGuild.unban(user);
			}
		});

		client.on("roleCreate", (role) => {
			if (realGuild == undefined) return;
			if (role.guild.id === realGuild.id) {
				testGuild.createRole({
					name: role.name,
					color: role.color,
					hoist: role.hoist,
					position: role.position,
					mentionable: role.mentionable,
				});
			}
		});

		client.on("roleDelete", (role) => {
			if (realGuild == undefined) return;
			if (role.guild.id === realGuild.id) {
				testGuild.roles.find("name", role.name).delete();
			}
		});

		client.on("roleUpdate", async function(oldRole, newRole) {
			if (realGuild == undefined) return;
			if (oldRole.guild.id === realGuild.id) {
				if (oldRole.name !== "Multicolored" && newRole.name !== "Multicolored") {
					var role = testGuild.roles.find("name", oldRole.name);
					await role.setHoist(newRole.hoist);
					await role.setMentionable(newRole.mentionable);
					await role.setColor(newRole.hexColor);
					await role.setPosition(newRole.position);
					await role.setName(newRole.name);
				}
			}
		});
	}
};
