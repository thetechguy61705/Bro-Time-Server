const { Collection } = require("discord.js");
const EMOJI_SERVERS = [
	"453694109819994114",
	"449723170790965251",
	"449724855278108672"
];

module.exports = {
	id: "emojis",
	emojis: new Collection(),
	exec: function (client) {
		for (var emoji of client.emojis.filter((e) => EMOJI_SERVERS.includes(e.guild.id)).array()) {
			this.emojis.set(emoji.name, emoji);
		}
	}
};
