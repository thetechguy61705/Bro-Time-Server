var errorHandler = require("app/errorHandler");
var config = require("../config");
var Enum = require("enum");
var fs = require("fs");
var discord = require("discord.js");
var stdout = process.stdout;
var loaders = [];
var chatHandlers = [];
var client = new discord.Client(config.CLIENT);

const LOAD_TIMEOUT = 60000

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

	constructor(size) {
		this.buffer = Buffer.alloc(size + 1);
		stdout.write(this.buffer);
		this.timeout = client.setTimeout(() => { this.writeState(Profiler.states.Timeout); }, LOAD_TIMEOUT);
	}

	newSubProfiler() {

	}

	writeStart(id) {
		this.buffer.write(id + " ");
	}

	writeState(state) {
		if (state === Profiler.states.Ended)
			clearTimeout(this.timeout);
		this.buffer.write(state.symbol);
	}
}
Object.defineProperty(Profiler, "states", {
	value: new Enum(["Started", "Ended", "Timeout"])
});
Profiler.states.Started.symbol = "S";
Profiler.states.Started.description = "Loading has started.";
Profiler.states.Ended.symbol = "E";
Profiler.states.Ended.description = "Finished loading."
Profiler.states.Timeout.symbol = "T";
Profiler.states.Timeout.description = "Took too long to load.";
Profiler.states.freezeEnums();

fs.readdirSync(__dirname + "/chat").forEach(file => {
	if (file.endsWith(".js")) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + file));
			} catch (exc) {
				reject(exc);
			}
		}).then(handler => {
			chatHandlers.push(handler);
		}, exc => {
			console.warn(`Unable to load chat module ${file}:`);
			console.warn(exc.stack);
		});
	}
});
fs.readdirSync(__dirname + "/load").forEach(file => {
	if (file.endsWith(".js")) {
		loaders.push(require("./load/" + file));
	}
});

errorHandler(client);

client.on("ready", () => {
	// eslint-disable-next-line no-console
	console.log("Loading...");
	Profiler.writeLegend();
	loaders.forEach(loader => {
		new Promise((resolve) => {
			var profiler = new Profiler(loader.id.length + (loader.profilerBytes || 2));
			profiler.writeStart(loader.id);
			if (loader.exec != null)
				loader.exec(client);
		});
	});
	// eslint-disable-next-line no-console
	console.log("Finished loading!");
});

client.on("message", message => {
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

client.login(config.TOKEN);

process.on("SIGTERM", async () => {
	await client.destroy();
});
