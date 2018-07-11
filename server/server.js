const Discord = require("discord.js");
const fs = require("fs");
// todo: Move configuration to config.js.
const BRO_TIME_GUILDS = ["330913265573953536", "453694109819994114", "463408396872187904", "398948242790023168"];
const LOAD_TIMEOUT = 60000;

var errorHandler = require("app/errorHandler");
var config = require("../config");
var loaders = [];
var chatHandlers = [];
var client = new Discord.Client(config.CLIENT);

client.locked = false;
client.lockedChannels = [];
client.bbkLocked = false;
client.bbkLockedChannels = [];

errorHandler(client);
require("enum").register();

for (let file of fs.readdirSync(__dirname + "/chat")) {
	if (file.endsWith(".js")) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + file));
			} catch (exc) {
				reject(exc);
			}
		}).then((handler) => {
			chatHandlers.push(handler);
		}, (exc) => {
			console.warn(`Unable to load chat module ${file}:`);
			console.warn(exc.stack);
		});
	}
}

for (let file of fs.readdirSync(__dirname + "/load")) {
	if (file.endsWith(".js")) {
		loaders.push(require("./load/" + file));
	}
}

client.on("ready", () => {
	var loading = [];
	for (let loader of loaders) {
		if (!loader.needs || client.guilds.has(loader.needs)) {
			loading.push(new Promise((resolve) => {
				var timeout = client.setTimeout(() => {
					console.warn(`Loader ${loader.id} took too long to load.`);
					resolve();
				}, LOAD_TIMEOUT);
				try {
					if (loader.exec != null) {
						var promise = loader.exec(client);
						if (promise != null)
							loading.push(promise);
					}
				} catch (exc) {
					console.warn("Failed to load loader:");
					console.warn(exc.stack);
				}
				clearTimeout(timeout);
				resolve();
			}));
		}
	}
	for (let handler of chatHandlers) {
		loading.push(new Promise((resolve) => {
			var timeout = client.setTimeout(() => {
				console.warn(`Chat handler ${handler.id} took too long to load.`);
				resolve();
			}, LOAD_TIMEOUT);
			try {
				if (handler.load != null) {
					var promise = handler.load(client);
					if (promise != null)
						loading.push(promise);
				}
			} catch (exc) {
				console.warn("Failed to load chat message:");
				console.warn(exc.stack);
			}
			clearTimeout(timeout);
			resolve();
		}));
	}

	Promise.all(loading).then(() => {
		client.on("message", (message) => {
			for (let handler of chatHandlers) {
				try {
					// todo: Move client out of the arguments of handler.exec.
					if (handler.exec(message, client))
						break;
				} catch (exc) {
					console.warn("Failed to handle chat message:");
					console.warn(exc.stack);
				}
			}
		});

		// eslint-disable-next-line no-console
		console.log("Shard loaded!");
	});
});

client.login(config.TOKEN);

process.on("SIGTERM", async () => {
	await client.destroy();
});

module.exports = {
	client: client,
	guilds: BRO_TIME_GUILDS
};
