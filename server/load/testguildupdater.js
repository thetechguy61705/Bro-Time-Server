module.exports = {
	exec: (client) => {
		var testGuild = client.guilds.get("430096406275948554");
		var realGuild = client.guilds.get("330913265573953536");
		client.on("message", (message) => {
			if(message.guild.id === realGuild.id) {
				testGuild.channels.find("name", message.channel.name).send(`**${message.author.tag}** (${message.author.id})\n\`\`\`${message.content} \`\`\``);
			}
		});
		client.on("channelCreate", (channel) => {
			if(channel.guild.id === realGuild.id) {
				testGuild.createChannel(channel.name, channel.type).then(function(newChannel) {
					newChannel.setParent(testGuild.channels.find("name", newChannel.parent.name));
				});
			}
		});
		client.on("channelDelete", (channel) => {
			if(channel.guild.id === realGuild.id) {
				testGuild.channels.find("name", channel.name).delete();
			}
		});
		client.on("channelUpdate", (oldChannel, newChannel) => {
			if(oldChannel.guild.id === realGuild.id) {
				testGuild.channels.find("name", oldChannel.channel.name).setName(newChannel.name);
				if(oldChannel.type === "text") testGuild.channels.find("name", oldChannel.channel.name).setTopic(newChannel.topic);
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
