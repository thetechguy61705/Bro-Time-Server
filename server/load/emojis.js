const { Collection } = require("discord.js");

module.exports = {
	id: "emojis",
	emojis: new Collection(),
	exec: (client) => {
		for (var emoji of client.emojis.filter((e) => e.guild.name.toLowerCase().includes("emoji")).array()) {
			module.exports.emojis.set(emoji.name, emoji);
		}
	}
};
