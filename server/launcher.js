const config = require("../config");
const { ShardingManager } = require("discord.js");
const manager = new ShardingManager(__dirname + "/server.js", { token: config.TOKEN });

/* eslint-disable no-console */

console.log("Launching shards...");

manager.spawn(manager.totalShards, 30000);

manager.on("launch", (shard) => {
	console.log(`Launched shard ${shard.id}`);
});

manager.on("message", (shard, message) => {
	console.log(`Recieved a message from ${shard.id}`, message);
});

/* eslint-enable no-console */
