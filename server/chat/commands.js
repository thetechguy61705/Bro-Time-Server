var modules = {};
var { MessageMentions } = require("discord.js");
var Parameters = require("./utility/paramaters");
var { CommandAccess } = require("./../../data/server");
var fs = require("fs");
var util = require("util");
var prefixPattern = "^(%s)";
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
			message.data.prefix), "i"));
		var using;
		if (prefix !== null) {
			using = true;
		} else {
			prefix = message.content.match("^" + MessageMentions.USERS_PATTERN.source);
			using = prefix !== null &&
				message.mentions.users.size === 1 &&
				message.mentions.users.first().id == client.user.id;
		}
		if (using) {
			var params = new Parameters(message);
			params.offset(prefix[0].length);
			params.readSeparator();
			var command = modules[params.readParameter()];

			if (command !== undefined) {
				var data = load(command);
				if (data.canAccess(message)) {
					params.readSeparator();
					command.execute({message: message, client: client, params: params});
				}
			}
		}
	}
};
