var config = require("./config");
var http = require("http");
var fs = require("fs");
var discord = require("discord.js");
var server;

var loaders = [];
var chatHandlers = [];

function handleRequest(request, response) {
	response.setHeader("Location", "https://github.com/cloewen8/Bro-Time-Server");
	response.statusCode = 307;
	response.end();
}

fs.readdirSync(__dirname + "/load").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null)
		loaders.push(require("./load/" + match[1]));
});
fs.readdirSync(__dirname + "/chat").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("./chat/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then(handler => {
			chatHandlers.push(handler);
		}, exc => {
			console.warn("A chat handler failed to load: %s (reason: %s)", match[1], exc);
		});
	}
});
config.TOKENS.forEach(token => {
	let client = new discord.Client();

	client.on("ready", () => {
		loaders.forEach(loader => {
			loader.exec(client);
		});
	});

	client.on("message", message => {
		for (var i = 0; i < chatHandlers.length; i++) {
			if (chatHandlers[i].exec(message, client))
				break;
		}
	});

	client.login(token);
});

server = http.createServer(handleRequest);
server.listen(process.env.PORT || 8080, (err) => {
	if (err) {
		return console.error(err);
	}

	console.log(`Server started on port ${process.env.PORT || 8080}`);
});
