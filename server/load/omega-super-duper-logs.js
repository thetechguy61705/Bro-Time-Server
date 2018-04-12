const Discord = require("discord.js");

module.exports = {
	exec: (client) => {
		var testGuild = client.guilds.get("430096406275948554");
		var realGuild = client.guilds.get("330913265573953536");
		client.on("messageUpdate", (oldMessage, newMessage) => {
			if (oldMessage.guild.id === realGuild.id) {
				var superLogChannel = testGuild.channels.get("433800038213353483");
				var updateEmbed = new Discord.RichEmbed()
					.setAuthor(`${oldMessage.author.tag} (${oldMessage.author.id})`)
					.setTitle("Message Update")
					.setField("Old Message", `\`\`\`${oldMessage.content}\`\`\`\nAt: \`${oldMessage.createdAt}\``)
					.setField("New Message", `\`\`\`${newMessage.content}\`\`\`\nAt: \`${newMessage.createdAt}\``);
				superLogChannel.send({
					embed: updateEmbed
				});
			}
		});
	}
};
