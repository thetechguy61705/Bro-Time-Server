const { ShardingManager } = require("discord.js");
const config = require("../config");
const manager = new ShardingManager(__dirname + "/server.js", { token: config.TOKEN });

/* eslint-disable no-console */

console.log("Launching shards...");

manager.spawn();

manager.on("launch", (shard) => {
	console.log(`Launched shard ${shard.id}`);
});

manager.on("message", (shard, message) => {
	console.log(`Recieved a message from shard ${shard.id}`);
	console.log(message);
});

/* eslint-enable no-console */
