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
							.addField("Old Message", `\`\`\`${oldMessage.content} \`\`\`\nIn: ${oldMessage.channel}\nAt: \`${oldMessage.createdAt}\``)
							.addField("New Message", `\`\`\`${newMessage.content} \`\`\`\nIn: ${oldMessage.channel}\nAt: \`${newMessage.createdAt}\``);
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
							.addField("Message", `\`\`\`${message.content} \`\`\`\nDeleted in: ${message.channel}\nDeleted at: \`${Date.new()}\``);
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
						var executor = logs.entries.first().executor;
						var superLogChannel = testGuild.channels.get("433800038213353483");
						var channelCreateEmbed = new Discord.RichEmbed()
							.setAuthor(`${executor.tag} (${executor.id})`)
							.setColor("GREEN")
							.setTitle("Channel Create")
							.addField("Channel", `Name: \`${channel.name}\`\nCreated At: \`${channel.createdAt}\``);
						superLogChannel.send({
							embed: channelCreateEmbed
						});
					});
				}
			}
		});
	}
};
