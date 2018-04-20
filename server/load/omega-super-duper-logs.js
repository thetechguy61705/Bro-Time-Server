const Discord = require("discord.js");

module.exports = {
	exec: (client) => {
		var testGuild = client.guilds.get("430096406275948554");
		var realGuild = client.guilds.get("330913265573953536");
		client.on("messageUpdate", (oldMessage, newMessage) => {
			if (oldMessage.channel.type !== "dm") {
				if (oldMessage.guild.id === realGuild.id) {
					if (!oldMessage.author.bot) {
						var superLogChannel = testGuild.channels.get("433800038213353483");
						var updateEmbed = new Discord.RichEmbed()
							.setAuthor(`${oldMessage.author.tag} (${oldMessage.author.id})`)
							.setColor("BLUE")
							.setTitle("Message Update")
							.setDescription(`ID: ${oldMessage.id}`)
							.addField("Old Message", `\`\`\`${oldMessage.content} \`\`\`\nIn: ${oldMessage.channel}\nAt: \`${oldMessage.createdAt}\``)
							.addField("New Message", `\`\`\`${newMessage.content} \`\`\`\nIn: ${newMessage.channel}\nAt: \`${newMessage.createdAt}\``);
						superLogChannel.send({
							embed: updateEmbed
						});
					}
				}
			}
		});

		client.on("messageDelete", (message) => {
			if (message.channel.type !== "dm") {
				if (message.guild.id === realGuild.id) {
					if (!message.author.bot) {
						var superLogChannel = testGuild.channels.get("433800038213353483");
						var updateEmbed = new Discord.RichEmbed()
							.setAuthor(`${message.author.tag} (${message.author.id})`)
							.setColor("RED")
							.setTitle("Message Delete")
							.setDescription(`ID: ${message.id}`)
							.addField("Message", `\`\`\`${message.content} \`\`\`\nDeleted in: ${message.channel}\nDeleted at: \`soon:tm:\``);
						superLogChannel.send({
							embed: updateEmbed
						});
					}
				}
			}
		});

		client.on("channelCreate", (channel) => {
			if (channel.type !== "dm") {
				if (channel.guild.id === realGuild.id) {
					realGuild.fetchAuditLogs({
						type: "CHANNEL_CREATE",
					}).then(logs => {
						var executor = logs.entries.first();
						var superLogChannel = testGuild.channels.get("433800038213353483");
						var topic = null;
						if (channel.type === "text") topic = channel.topic;
						var channelCreateEmbed = new Discord.RichEmbed()
							.setAuthor(`${executor.executor.tag} (${executor.excutor.id})`)
							.setColor("GREEN")
							.addField("Channel Create", `Name: \`${channel.name}\`\nType: \`${channel.type}\`\nTopic: \`${topic}\`\nID: \`${channel.id}\``);
						superLogChannel.send({
							embed: channelCreateEmbed
						});
					});
				}
			}
		});

		client.on("channelDelete", (channel) => {
			if (channel.type !== "dm") {
				if (channel.guild.id === realGuild.id) {
					realGuild.fetchAuditLogs({
						type: "CHANNEL_DELETE",
					}).then(logs => {
						var executor = logs.entries.first().executor;
						var superLogChannel = testGuild.channels.get("433800038213353483");
						var topic = null;
						if (channel.type === "text") topic = channel.topic;
						var channelDeleteEmbed = new Discord.RichEmbed()
							.setAuthor(`${executor.tag} (${executor.id})`)
							.setColor("RED")
							.addField("Channel Delete", `Name: \`${channel.name}\`\nType: \`${channel.type}\`\nTopic: \`${topic}\`\nID: \`${channel.id}\``);
						superLogChannel.send({
							embed: channelDeleteEmbed
						});
					});
				}
			}
		});

		client.on("channelUpdate", (oldChannel, newChannel) => {
			if (oldChannel.type !== "dm") {
				if (oldChannel.guild.id === realGuild.id) {
					realGuild.fetchAuditLogs({
						type: "CHANNEL_DELETE",
					}).then(logs => {
						var executor = logs.entries.first().executor;
						var superLogChannel = testGuild.channels.get("433800038213353483");
						var topic = "text channel only";
						if (oldChannel.type === "text") topic = oldChannel.topic;
						var newTopic = "text channel only.";
						if (newChannel.type === "text") newTopic = newChannel.topic;
						var bps = "voice channel only.";
						if (oldChannel.type === "voice") bps = oldChannel.bitrate;
						var newBps = "voice channel only.";
						if (newChannel.type === "voice") newBps = newChannel.bitrate;
						var limit = "voice channel only.";
						var newLimit = "voice channel only.";
						if (newChannel.type === "voice") {
							if (oldChannel.userLimit === 0) limit = "infinity";
							if (oldChannel.userLimit !== 0) limit = oldChannel.userLimit;
							if (newChannel.userLimit === 0) newLimit = "infinity";
							if (newChannel.userLimit !== 0) newLimit = newChannel.userLimit;
						}
						if (topic !== newTopic || bps !== newBps || limit !== newLimit || oldChannel.name !== newChannel.name) {
							var channelUpdateEmbed = new Discord.RichEmbed()
								.setAuthor(`${executor.tag} (${executor.id})`)
								.setColor("BLUE")
								.setTitle("Channel Update")
								.setDescription(`ID: ${oldChannel.id}`)
								.addField("Old Channel", `Name: \`${oldChannel.name} \`\nType: \`${oldChannel.type} \`\nTopic: \`${topic} \`\nBPS: \`${bps} \`\n` +
									`Max Members in channel: \`${limit} \``)
								.addField("New Channel", `Name: \`${newChannel.name} \`\nType: \`${newChannel.type} \`\nTopic: \`${newTopic} \`\nBPS: \`${newBps} \`\n` +
									`Max Members in channel: \`${newLimit} \``);
							superLogChannel.send({
								embed: channelUpdateEmbed
							});
						}
					});
				}
			}
		});

		client.on("roleCreate", (role) => {
			if (role.guild.id === realGuild.id) {
				realGuild.fetchAuditLogs({
					type: "ROLE_CREATE",
				}).then(logs => {
					var executor = logs.entries.first().executor;
					var superLogChannel = testGuild.channels.get("433800038213353483");
					var roleUpdateEmbed = new Discord.RichEmbed()
						.setAuthor(`${executor.tag} (${executor.id})`)
						.setColor(role.hexColor)
						.addField("Role Create", `Name: \`${role.name}\`\nColor: \`${role.hexColor}\`\nHoist: \`${role.hoist}\`\n` +
							`Mentionable: \`${role.mentionable}\``);
					superLogChannel.send({
						embed: roleUpdateEmbed
					});
				});
			}
		});
	}
};
