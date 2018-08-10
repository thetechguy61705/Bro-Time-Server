const { RichEmbed, version } = require("discord.js");

async function getProp(prop, client) {
	var val = await client.shard.broadcastEval(prop);
	return val.reduce((a, b) => { return a + b; }, 0);
}

module.exports = {
	id: "statistics",
	aliases: ["stats"],
	description: "Displays the bot statistics.",
	access: "Public",
	exec: async (call) => {
		var servers = await getProp("this.guilds.size", call.client);
		var users = await getProp("this.users.size", call.client);

		const statsEmbed = new RichEmbed()
			.setTitle("Bot Statistics")
			.setDescription("These are the statistics of Bro Bot.")
			.addField("Servers", servers.toString(), true)
			.addField("Users", users.toString(), true)
			.addField("Commands", call.commands.loaded.size.toString(), true)
			.addField("Library", `discord.js ${version}`, true)
			.addField("Shards", `${call.client.shard.count} (current: ${call.client.shard.id + 1})`, true)
			// replace blank field with another field stat when added
			.addBlankField(true)
			.setColor(0x00AE86)
			.setDefaultFooter(call.message.author);
		call.safeSend({ embed: statsEmbed });
	}
};
