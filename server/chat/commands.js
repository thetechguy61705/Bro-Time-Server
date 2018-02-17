var modules = {};
var Parameters = require("./utility/paramaters");
var { CommandAccess } = require("./../../data/server");
var fs = require("fs");
var util = require("util");
var prefixPattern = "^(<@%d>|%s)";
var data = {};

fs.readdirSync(__dirname + "/../commands").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("../commands/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then(module => {
			modules[module.id] = module;
		}, exc => {
			console.warn("A command failed to load: %s (reason: %s)", match[1], exc);
		});
	}
});

function load(command) {
	var commandData = data[command.id];
	if (commandData === undefined)
		commandData = new CommandAccess(command);
	return commandData;
}

module.exports = {
	exec: function(message, client) {
		var prefix = message.content.match(new RegExp(util.format(prefixPattern,
			client.user.id,
			message.data.prefix), "i"));
		if (prefix !== null) {
			var params = new Parameters(message);
			params.offset(prefix[0].length);
			params.readSeparator();
			var command = modules[params.readParameter()];

			if (command !== undefined) {
				var data = load(command);
				if (data.canAccess(message)) {
					params.readSeparator();
					// Call the command.
					command.execute({message: message, client: client, params: params});
				}
			}
		}
	}
};
