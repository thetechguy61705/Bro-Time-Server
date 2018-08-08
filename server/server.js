const Discord = require("discord.js");
const { load } = require("@utility/filesloader.ts");
const dataProcessor = require("@utility/datarequest.ts");
// todo: Move configuration to config.js.
const BRO_TIME_GUILDS = ["330913265573953536", "453694109819994114", "463408396872187904", "398948242790023168"];
const LOAD_TIMEOUT = 60000;

var errorHandler = require("@utility/errorHandler");
var config = require("@root/config");
var loaders = [];
var chatHandlers = [];
var client = new Discord.Client(config.CLIENT);

client.locked = false;
client.lockedChannels = [];
client.bbkLocked = false;
client.bbkLockedChannels = [];

module.exports = {
	client: client,
	locked: {
		value: false,
		channels: []
	},
	guilds: BRO_TIME_GUILDS
};

errorHandler(client);

load("load", {
	client: client,
	displayErrorStack: false,
	success: (exported) => {
		loaders.push(exported);
	},
	failure: (exc) => {
		console.warn("Failed to load:");
		throw exc;
	},
	TimeoutTime: LOAD_TIMEOUT,
	timeout: (exc) => {
		throw exc;
	},
	predicate: (exported) => {
		return !exported.needs || client.guilds.has(exported.needs);
	}
});

client.on("ready", () => {
	var loading = [];

	dataProcessor.setClient(client);
	process.on("message", (message) => {
		if (message.sentInstance === "DataResponse") {
			dataProcessor.processRequest(message);
		}
	});

	for (let loader of loaders) {
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
	loading.push(load("chat", {
		client: client,
		failureMessage: "Unable to load chat module:",
		success: (exported) => {
			chatHandlers.push(exported);
		},
		TimeoutTime: LOAD_TIMEOUT
	}));

	Promise.all(loading).then(() => {
		client.on("message", (message) => {
			if (!message.author.bot) {
				for (let handler of chatHandlers) {
					try {
						// todo: Move client out of the arguments
						// handler.exec.
						handler.exec(message, client);
					} catch (exc) {
						console.warn("Failed to handle chat message:");
						console.warn(exc.stack);
					}
				}
			}
		});

		// eslint-disable-next-line no-console
		console.log(`Loaded shard ${client.shard.id}!`);
	});
});

client.on("disconnect", () => {
	console.warn(`Shard ${client.shard.id} disconnected from the WebSocket.`);
});

client.on("error", (exc) => {
	console.warn(`Shard ${client.shard.id} recieved a connection error:`);
	console.warn(exc);
});

client.login(config.TOKEN);

process.on("SIGTERM", async () => {
	await client.destroy();
});
