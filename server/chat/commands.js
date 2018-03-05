var modules = {};
var { Collection, MessageMentions } = require("discord.js");
var Parameters = require("./utility/paramaters");
var { CommandAccess } = require("./../../data/server");
var fs = require("fs");
var util = require("util");
var prefixPattern = "^(%s)";
var data = {};

class Call {
	constructor(commands, message, client, params) {
		this.commands = commands;
		this.message = message;
		this.client = client;
		this.params = params;
	}

	requestInput(settings) {
		return new Promise(((resolve, reject) => {
			this.commands._requests.set(this.message.author.id, {resolve: resolve, reject: reject, settings: settings});
		}).bind(this));
	}

	denyInput(author = this.message.author) {
		if (this.commands._requests.has(author.id)) {
			this.commands._requests.get(author.id).reject();
			this.commands._requests.delete(author.id);
		}
	}
}

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
	_requests: new Collection(),

	exec: function(message, client) {
		var used = false;
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
					command.execute(new Call(this, message, client, params));
					used = true;
				}
			}
		}
		return used;
	}
};
