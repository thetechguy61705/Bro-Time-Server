const { RichEmbed } = require("discord.js");

module.exports = {
	id: "statistics",
	aliases: ["stats"],
	description: "Displays the bot statistics.",
	access: "Public",
	exec: async (call) => {
		var servers = await call.client.shard.broadcastEval("this.guilds.size");
		servers = servers.reduce((a, b) => { return a + b; }, 0);

		const statsEmbed = new RichEmbed()
			.setTitle("Bot Statistics")
			.setDescription("These are the statistics of Bro Bot.")
			.addField("Servers", servers.toString(), true)
			.setColor(0x00AE86)
			.setDefaultFooter(call.message.author);
		call.safeSend(null, call.message, { embed: statsEmbed });
	}
};
