var http = require("http");
var discord = require("discord.js");
var server;

var chatHandlers = [];

var BOTS = [
	process.env.BRO_TIME_TOKEN,
	process.env.KITCHEN_TOKEN
];
var CHAT = ["greeting", "commands"];

function handleRequest(request, response) {
	response.setHeader("Location", "https://github.com/cloewen8/Bro-Time-Server");
	response.statusCode = 307;
	response.end();
}

CHAT.forEach(name => {
	new Promise((resolve, reject) => {
		try {
			resolve(require("./chat/" + name));
		} catch (exc) {
			reject(exc);
		}
	}).then(handler => {
		chatHandlers.push(handler);
	}, exc => {
		console.warn("A chat handler failed to load: %s (reason: %s)", name, exc);
	});
});
BOTS.forEach(token => {
	let client = new discord.Client();

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
