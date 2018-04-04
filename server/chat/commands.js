var { Collection, MessageMentions } = require("discord.js");
var modules = new Collection();
var Parameters = require("./utility/paramaters");
var { CommandAccess } = require("./../../data/server");
var report = require("./../report");
var fs = require("fs");
var util = require("util");
var prefixPattern = "^(%s)";
var data = {};

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
		//eslint-disable-next-line
		if (prompt != null)
			this.message.channel.send(prompt.toString());
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

fs.readdirSync(__dirname + "/../commands").forEach(file => {
	var match = file.match(/^(.*)\.js$/);
	if (match !== null) {
		new Promise((resolve, reject) => {
			try {
				var module = require("../commands/" + match[1]);
				if (TESTING || module.test !== true)
					resolve(module);
			} catch (exc) {
				reject(exc);
			}
		}).then(module => {
			modules.set(module.id, module);
		}, exc => {
			report(exc, {tags: {category: "commands", action: "load", item: match[1]}});
		});
	}
});

function load(command) {
	var commandData = data[command.id];
	if (commandData === undefined) {
		commandData = new CommandAccess(command);
		commandData.load();
	}
	return commandData;
}

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
						report(exc, {tags: {category: "commands", action: "execute", item: name}});
						message.channel.send(`The ${name} command failed to load.`);
					}
				}
			}
		}
		return used;
	}
};
