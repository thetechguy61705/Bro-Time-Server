const { RichEmbed } = require("discord.js");

module.exports = {
	id: "shards",
	aliases: ["shardinfo"],
	description: "Returns information on Bro Bot's shards.",
	access: "Public",
	execute: async (call) => {
		var shards = await call.client.shard.broadcastEval("var info = `Shard ${this.shard.id} | Servers ${this.guilds.size} | Ping ${this.pings[0]}ms`;info.padEnd(info.length+10);");
		var shardEmbed = new RichEmbed()
			.setTitle("Shards")
			.setDescription("```" + shards.join("\n") + "```")
			.setColor(0x00AE86)
			.setDefaultFooter(call.message.author);
		call.safeSend(null, call.message, { embed: shardEmbed });
	}
};
