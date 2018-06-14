var errorHandler = require("app/errorHandler");
var config = require("../config");
var fs = require("fs");
var Discord = require("discord.js");
var stdout = process.stdout;
var loaders = [];
var chatHandlers = [];
var client = new Discord.Client(config.CLIENT);
client.locked = false;
client.lockedChannels = [];

const LOAD_TIMEOUT = 60000;

require("enum").register();

class Profiler {
	static writeLegend() {
		var rows = [];
		var descLength = Math.max.apply(Math, Profiler.states.enums.map((state) => state.description.length));
		rows.push(`┏━┳${"━".repeat(descLength)}┓`);
		rows.push(`┃S┃${"Description".padEnd(descLength)}┃`);
		rows.push(`┣━╋${"━".repeat(descLength)}┫`);
		for (var state of Profiler.states)
			rows.push(`┃${state.symbol}┃${state.description.padEnd(descLength)}┃`);
		rows.push(`┗━┻${"━".repeat(descLength)}┛`);
		// eslint-disable-next-line no-console
		console.log(rows.join("\n"));
	}

	constructor(size, parent) {
		this.states = Profiler.states;
		this.parent = parent;
		this.ended = false;
		this.used = [];
		this.buffer = Buffer.alloc(size + 2);
		this.offset = 0;
		this.subProfilers = [];
	}

	newSubProfiler(size) {
		var subProfiler = new Profiler(this.id.length + size + 4, this);
		subProfiler.buffer.write(this.id, subProfiler.offset);
		subProfiler.offset += this.id.length;
		subProfiler.buffer.write(" -> ", subProfiler.offset);
		subProfiler.offset += 4;
		this.subProfilers.push(subProfiler);
		return subProfiler;
	}

	writeStart(id) {
		this.id = id;
		this.buffer.write(id + " ", this.offset);
		this.offset += id.length + 1;
	}

	writeState(state) {
		var subProfiler;
		if (!this.ended && !this.used.some((other) => other === state)) {
			this.buffer.write(state.symbol, this.offset);
			this.offset += state.symbol.length;
			if (state.ends) {
				this.ended = true;
				this.buffer.write("\n", this.offset);
				stdout.write(this.buffer, "ascii");
				if (state === Profiler.states.Error) {
					if (this.parent != null)
						this.parent.writeState(state);
					for (subProfiler of this.subProfilers)
						subProfiler.writeState(Profiler.states.Interrupted);
				} else if (state !== Profiler.states.Ended) {
					for (subProfiler of this.subProfilers)
						subProfiler.writeState(state);
				}
			}
		}
	}
}
Object.defineProperty(Profiler, "states", {
	value: new Enum(["Started", "Ended", "Timeout", "Error", "Interrupted"])
});
Profiler.states.Started.symbol = "S";
Profiler.states.Started.description = "Loading has started.";
Profiler.states.Ended.symbol = "F";
Profiler.states.Ended.description = "Finished loading.";
Profiler.states.Ended.ends = true;
Profiler.states.Timeout.symbol = "T";
Profiler.states.Timeout.description = "Took too long to load.";
Profiler.states.Timeout.ends = true;
Profiler.states.Error.symbol = "E";
Profiler.states.Error.description = "An error occured.";
Profiler.states.Error.ends = true;
Profiler.states.Interrupted.symbol = "I";
Profiler.states.Interrupted.description = "A parent loader interrupted this loader.";
Profiler.states.Interrupted.ends = true;
Profiler.states.freezeEnums();

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

errorHandler(client);

client.on("ready", () => {
	var loading = [];
	// eslint-disable-next-line no-console
	console.log("Loading...");
	Profiler.writeLegend();
	for (var loader of loaders) {
		loading.push(new Promise(async (resolve) => {
			var profiler = new Profiler(loader.id.length + (loader.profilerBytes || 2));
			profiler.writeStart(loader.id);
			var timeout = client.setTimeout(() => {
				profiler.writeState(Profiler.states.Timeout);
				resolve();
			}, LOAD_TIMEOUT);
			try {
				profiler.writeState(Profiler.states.Started);
				if (loader.exec != null) {
					var promise = loader.exec(client, profiler);
					if (promise != null)
						await promise;
				}
				profiler.writeState(Profiler.states.Ended);
			} catch (exc) {
				profiler.writeState(Profiler.states.Error);
				console.warn(exc.stack);
			}
			clearTimeout(timeout);
			resolve();
		}));
	}
	Promise.all(loading).then(() => {
		for (var handler of chatHandlers) {
			try {
				if (handler.load != null) handler.load(client);
			} catch (exc) {
				console.warn("Failed to load chat message:");
				console.warn(exc.stack);
			}
		}
		client.on("message", (message) => {
			for (var handler of chatHandlers) {
				try {
					if (handler.exec(message, client))
						break;
				} catch (exc) {
					console.warn("Failed to handle chat message:");
					console.warn(exc.stack);
				}
			}
		});

		// eslint-disable-next-line no-console
		console.log("Finished loading!");
	}).catch(() => {});
});

client.login(config.TOKEN);

process.on("SIGTERM", async () => {
	await client.destroy();
});
