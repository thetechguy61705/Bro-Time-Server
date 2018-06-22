var { Collection, MessageMentions } = require("discord.js");
var escapeStringRegexp = require("escape-string-regexp");
var modules = new Collection();
var Parameters = require("app/paramaters");
var { WalletAccess } = require("./../../data/server");
var fs = require("fs");
var path = require("path");
var util = require("util");
var prefixPattern = "^(%s)";

const COMMANDS = __dirname + "/../commands";
const TESTING = process.env.NODE_ENV !== "production";
const ACCESS = new Enum(["Public", "Private", "Server"], { ignoreCase: true });

class Call {
	constructor(commands, message, client, params, command) {
		this.commands = commands;
		this.message = message;
		this.client = client;
		this.params = params;
		this.command = command;
		this.TRANSFER_RATE = 0.8;
	}

	requestInput(settings = 0, prompt = null, timeout = 180000) {
		settings = settings|this.commands.MULTISTEP_DEFAULTS;
		if (prompt != null)
			this.message.channel.send(prompt);
		return new Promise(((resolve, reject) => {
			this.denyInput();
			this.commands._requests.set(this.message.author.id, {
				resolve: resolve,
				reject: reject,
				settings: settings,
				author: this.message.author.id,
				channel: this.message.channel.id,
				timeout: this.client.setTimeout(() => this.denyInput(), timeout)
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

	getWallet(userId = null) {
		return new WalletAccess(userId);
	}

	safeSend(content, message = this.message, options = { reply: this.message.author }) {
		message.channel.send((content || options), (content != null) ? options : undefined).catch((exc) => {
			message.author.send(`You attempted to use the \`${this.command.id}\` command in ${message.channel}, but I can not chat there.`);
			console.warn(exc.stack);
		});
	}
}

function loadModule(file, category) {
	new Promise((resolve, reject) => {
		try {
			let module = require(file);
			if (TESTING || module.test !== true) {
				resolve(module);
			} else {
				throw null;
			}
		} catch (exc) {
			reject(exc);
		}
	}).then((module) => {
		module.category = (category != null) ? category : "Other";
		module.file = path.parse(file).name;
		modules.set(module.id, module);
	}, (exc) => {
		if (exc != null) {
			console.warn(`Command failed to load ${path.parse(file).name}:`);
			console.warn(exc.stack);
		}
	});
}

function hasPermissions(command, message, client) {
	var has = true;
	if (message.guild != null) {
		if (command.botRequires != null)
			has = client.requestPermissions(message.guild.members.get(client.user.id),
				message.channel,
				command.botRequires,
				command.botRequiresMessage || `To use ${command.id}.`);
		if (has && command.userRequires != null)
			has = client.requestPermissions(message.member,
				message.channel,
				command.userRequires,
				command.userRequiresMessage || `To use ${command.id}.`);
	}
	return has;
}

function checkAccess(command, message) {
	var access = ACCESS.get(command.access);
	var result;
	if (access === ACCESS.Public) {
		result = true;
	} else if (access === ACCESS.Private) {
		result = message.guild == null;
	} else {
		result = message.guild != null;
	}
	return result;
}

try {
	for (let name of fs.readdirSync(COMMANDS)) {
		try {
			let file = path.join(COMMANDS, name);
			let stats = fs.statSync(file);
			if (stats.isDirectory()) {
				for (let subname of fs.readdirSync(file)) {
					loadModule(path.join(file, subname), name);
				}
			} else {
				loadModule(file);
			}
		} catch (exc) {
			console.warn(`Failed to load file ${name}:`);
			console.warn(exc.stack);
		}
	}
} catch (exc) {
	console.warn("Failed to load commands:");
	console.warn(exc.stack);
}

module.exports = {
	MULTISTEP_DEFAULTS: 0,
	ANYONE: 0x00000001,
	CANCELLABLE: 0x00000002,

	_requests: new Collection(),

	loaded: modules,
	getRequesting: function(message) {
		var requests = this._requests.filter((request) => request.channel === message.channel.id);
		var request;
		if (requests.has(message.author.id)) {
			request = requests.get(message.author.id);
		} else if (requests.some((request) => request.settings&this.ANYONE !== 0)) {
			request = requests.find((request) => request.settings&this.ANYONE !== 0);
		}
		return request || null;
	},
	processRequest: function(request, message, client) {
		clearTimeout(request.timeout);
		if (request.settings&this.CANCELLABLE !== 0 && message.content.toLowerCase() === "cancel") {
			request.reject();
		} else {
			request.resolve(new Call(this, message, client, new Parameters(message)));
		}
		this._requests.delete(request.author);
		return true;
	},
	processCommand: function(message, client) {
		var data = (message.guild || message.channel).data;
		var prefix = message.content.match(new RegExp(util.format(prefixPattern,
			escapeStringRegexp(data != null ? data.prefix : "/")), "i"));
		var using;
		var used = false;
		if (prefix != null) {
			using = true;
		} else {
			prefix = message.content.match("^" + MessageMentions.USERS_PATTERN.source);
			using = prefix != null &&
				message.mentions.users.size === 1 &&
				message.mentions.users.first().id == client.user.id;
		}
		if (using) {
			var params = new Parameters(message);
			params.offset(prefix[0].length);
			params.readSeparator();
			var name = params.readParameter();
			if (name != null) {
				var command = modules.get(name.toLowerCase()) || modules.find((module) => module.aliases != null && module.aliases.includes(name));

				if (command != null && checkAccess(command, message) && hasPermissions(command, message, client)) {
					if (!client.locked || command.id === "lockdown") {
						params.readSeparator();
						command.execute(new Call(this, message, client, params, command));
						used = true;
					} else {
						if (!client.lockedChannels.includes(message.channel.id)) {
							client.lockedChannels.push(message.channel.id);
							message.channel.send("The client is currently in lockdown and inaccessible by any user.");
						}
					}
				}
			}
		}
		return used;
	},
	exec: function(message, client) {
		var used;
		var request = this.getRequesting(message);
		if (request != null) {
			if (message.author != client.user)
				used = this.processRequest(request, message, client);
		} else {
			used = this.processCommand(message, client);
		}
		return used;
	}
};
