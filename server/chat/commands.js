var { Collection, MessageMentions } = require("discord.js");
var modules = new Collection();
var Parameters = require("app/paramaters");
var { CommandAccess } = require("./../../data/server");
var walk = require("walk");
var path = require("path");
var util = require("util");
var prefixPattern = "^(%s)";
var data = {};

const COMMANDS = "../commands";
const TESTING = process.env.NODE_ENV !== "production";

class Call {
	constructor(commands, message, client, params) {
		this.commands = commands;
		this.message = message;
		this.client = client;
		this.params = params;
	}

	requestInput(settings = 0, prompt = null, timeout = 180000) {
		settings = settings|this.commands.MULTISTEP_DEFAULTS;
		if (prompt != null)
			this.message.channel.send(prompt.toString());
		return new Promise(((resolve, reject) => {
			this.denyInput();
			this.commands._requests.set(this.message.author.id, {
				resolve: resolve,
				reject: reject,
				settings: settings,
				author: this.message.author.id,
				channel: this.message.channel.id,
				timeout: setTimeout(() => this.denyInput(), timeout)
			});
		}).bind(this));
	}

	denyInput(author = this.message.author) {
		if (this.commands._requests.has(author.id)) {
			var request = this.commands._requests.get(author.id);
			clearTimeout(request.timeout);
			request.reject();
			this.commands._requests.delete(author.id);
		}
	}
}

function load(command) {
	var commandData = data[command.id];
	if (commandData === undefined) {
		commandData = new CommandAccess(command);
		commandData.load();
	}
	return commandData;
}


var walker = walk.walk(path.join(__dirname, COMMANDS));

walker.on("file", (root, stat, next) => {
	var match = stat.name.match(/^(.*)\.js$/);
	if (match != null) {
		new Promise((resolve, reject) => {
			try {
				console.log(path.relative(__dirname, path.join(root, match[1])));
				var module = require(path.relative(__dirname, path.join(root, match[1])));
				if (TESTING || module.test !== true) {
					resolve(module);
				} else {
					throw new Error("Not available in production environments.");
				}
			} catch (exc) {
				reject(exc);
			}
		}).then(module => {
			module.categories = path.relative(COMMANDS, root).split(path.sep);
			modules.set(module.id, module);
		}, exc => {
			console.warn(`Commaned failed to load ${match}:`);
			console.warn(exc.stack);
		});
	}
	next();
});

walker.on("errors", (root, stats) => {
	console.warn("Unable to load some command files:");
	stats.forEach((stat) => {
		console.warn(stat.error.stack);
	});
});

module.exports = {
	MULTISTEP_DEFAULTS: 0,
	ANYONE: 0x00000001,

	_requests: new Collection(),

	exec: function(message, client) {
		var used = false;
		var requests = this._requests.filter((request) => request.channel === message.channel.id);
		var request = null;
		if (requests.has(message.author.id)) {
			request = requests.get(message.author.id);
		} else if (requests.some((request) => request.settings&this.ANYONE !== 0)) {
			request = requests.find((request) => request.settings&this.ANYONE !== 0);
		}
		if (request != null) {
			request.resolve(new Call(this, message, client, new Parameters(message)));
			this._requests.delete(request.author);
		} else {
			var prefix = message.content.match(new RegExp(util.format(prefixPattern,
				message.data.prefix), "i"));
			var using;
			if (prefix != null) {
				using = true;
			} else {
				prefix = message.content.match("^" + MessageMentions.USERS_PATTERN.source);
				using = prefix != null &&
					message.mentions.users.size === 1 &&
					message.mentions.users.first().id == client.user.id;
			} if (using) {
				var params = new Parameters(message);
				params.offset(prefix[0].length);
				params.readSeparator();
				var name = params.readParameter();
				if (name != null) {
					try {
						var command = modules.get(name.toLowerCase()) || modules.find((module) => module.aliases != null && module.aliases.indexOf(name) > -1);

						if (command != null) {
							var data = load(command);
							if (data.canAccess(message)) {
								params.readSeparator();
								command.execute(new Call(this, message, client, params));
								used = true;
							}
						}
					} catch (exc) {
						console.warn(`Command failed to execute ${name}:`);
						console.warn(exc.stack);
						message.channel.send(`The ${name} command failed to load.`);
					}
				}
			}
		}
		return used;
	}
};
