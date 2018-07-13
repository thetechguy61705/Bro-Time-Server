const { ShardingManager } = require("discord.js");
const config = require("@root/config");
const manager = new ShardingManager(__dirname + "/server.js", { token: config.TOKEN });
const dataProcessor = require("@utility/datarequest.ts");

/* eslint-disable no-console */

console.log("Launching shards...");

manager.on("launch", (shard) => {
	console.log(`Launched shard ${shard.id}`);
});

manager.on("message", (shard, message) => {
	if (message.sentInstance === "DataRequest") {
		dataProcessor.processServer(message, shard);
	} else if (message.sentInstance === "DataResponse") {
		dataProcessor.processClient(message);
	} else if (!message._eval) {
		console.log(`Recieved a message from shard ${shard.id}:`);
		console.log(message);
	}
});

manager.spawn();

/* eslint-enable no-console */
