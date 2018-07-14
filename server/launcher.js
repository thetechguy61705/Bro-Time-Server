const { ShardingManager } = require("discord.js");
const dataProcessor = require("@utility/datarequest.ts");
const config = require("@root/config");
const manager = new ShardingManager(__dirname + "/server.js", config.SHARD);

/* eslint-disable no-console */

console.log("Launching shards...");

manager.on("launch", (shard) => {
	console.log(`Launched shard ${shard.id}!`);
});

manager.on("message", (shard, message) => {
	if (message.sentInstance === "DataRequest") {
		dataProcessor.processRequest(message, shard);
	} else if (!message._eval) {
		console.log(`Recieved a message from shard ${shard.id}:`);
		console.log(message);
	}
});

/* eslint-enable no-console */

manager.spawn();
