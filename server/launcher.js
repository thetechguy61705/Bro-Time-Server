const { ShardingManager } = require("discord.js");
const fs = require("fs");
const config = require("../config");
const manager = new ShardingManager(__dirname + "/server.js", { token: config.TOKEN });

var loaders = [];

for (let file of fs.readdirSync(__dirname + "/load")) {
	if (file.endsWith(".js")) {
		loaders.push(require("./load/" + file));
	}
}

/* eslint-disable no-console */

console.log("Launching shards...");

manager.spawn(manager.totalShards, 30000);

manager.on("launch", (shard) => {
	console.log(`Launched shard ${shard.id}`);
	for (let loader of loaders) {
		if (loader.exec) loader.exec(shard);
	}
});

manager.on("message", (shard, message) => {
	console.log(`Recieved a message from shard ${shard.id}`);
	console.log(message);
});

/* eslint-enable no-console */
