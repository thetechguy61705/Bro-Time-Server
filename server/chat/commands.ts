import { Message, Client, Guild, Collection, MessageMentions, User, MessageOptions } from "discord.js";
import { WalletAccess } from "@data/server";
import { IExecutable } from "types/server";
const escapeRegExp = require("escape-string-regexp");
const server = require("@server/server");
const fs = require("fs");
const path = require("path");
const util = require("util");
var modules = new Collection<string, ICommand>();
var prefixPattern = "^(%s)";

const COMMANDS = __dirname + "/../commands";
const TESTING = process.env.NODE_ENV !== "production";
const ACCESS = new Enum(["Public", "Private", "Server"], { ignoreCase: true });
const SPACE = "\\s,";
const QUOTES = "\"'";

export interface ICommand {
	readonly id: string
	readonly test?: boolean
	readonly aliases?: string[]
	readonly description?: string
	readonly paramsHelp?: string
	readonly access?: string | number
	category?: string
	file?: string
	execute(call: Call): void
}

interface IRequest {
	resolve(call: Call): void
	reject(): void
	readonly options: any
	readonly author: string
	readonly channel: string
	readonly timeout: NodeJS.Timer
	accepts(message: Message): boolean
}

export class Params {
	private readonly sep: RegExp
	private readonly sepGreedy: RegExp
	private readonly param: RegExp
	private readonly paramGreedy: RegExp
	private readonly raw: string
	private readonly client: Client
	private readonly guild: Guild
	private index: number

	public constructor(message: Message) {
		this.sep = new RegExp(`[${SPACE}]`, "y");
		this.sepGreedy = new RegExp(`[${SPACE}]+`, "y");
		this.param = new RegExp(`([${QUOTES}]).*?\\1|[^${SPACE}]+`, "y");
		this.paramGreedy = new RegExp(`([${QUOTES}]).*?\\1|[^${QUOTES}]+`, "y");
		this.raw = message.content;
		// Store the client for user access.
		this.client = message.client;
		// Store the guild for role access.
		this.guild = message.guild;
		this.index = 0;
	}

	private static normalizeParam(str: string): string {
		if (str.length > 1)
			str.trim().replace(new RegExp(`^[${QUOTES}]|[${QUOTES}]$`), "");
		return str;
	}

	public offset(offset: number): void {
		this.index += offset;
	}

	public hasFinished(): boolean {
		return this.index >= this.raw.length;
	}

	public readRaw(): string {
		return this.raw.substring(this.index);
	}

	public readSep(greedy = true): string {
		var value = null;
		if (!this.hasFinished()) {
			this.sep.lastIndex = this.index;
			this.sepGreedy.lastIndex = this.index;
			var match = this.raw.match(greedy ? this.sepGreedy : this.sep);
			if (match !== null) {
				this.index += match[0].length;
				value = match[0];
			}
		}
		return value;
	}

	public readParam(greedy = false, offset = true): string {
		var value = null;
		if (!this.hasFinished()) {
			var pattern = greedy ? this.paramGreedy : this.param;
			pattern.lastIndex = this.index;
			var match = this.raw.match(pattern);
			if (match != null) {
				value = match[0];
				if (offset) this.index += value.length;
				value = Params.normalizeParam(value);
				this.readSep();
			}
		}
		return value;
	}

	public readWord(classes = "", offset = true): string {
		var value = null;
		if (!this.hasFinished()) {
			var pattern = new RegExp(`[${classes}a-zA-Z]+`, "y");
			pattern.lastIndex = this.index;
			var match = this.raw.match(pattern);
			if (match !== null) {
				value = match[0];
				if (offset) this.index += value.length;
			}
		}
		return value;
	}

	public readNumber(offset = true): number {
		var param = this.readParam(false, offset);
		var value = null;
		if (param != null) {
			var number = parseFloat(param);
			if (!isNaN(number)) {
				value = number;
			}
		}
		return value;
	}

	public readObject(objects: Collection<string, any>,
		name = "name",
		mentions = /(.+)/,
		allowPartial = true,
		filter = () => true,
		offset = true) {
		var param = (this.readParam(true, offset) || "").toLowerCase();
		var mention = param.match(mentions);
		var object = null;
		if (mention != null) {
			param = mention[1];
		}

		if (param !== "") {
			var gap = Infinity;
			var id = parseFloat(param);
			var pattern = new RegExp(`\\b${escapeRegExp(param)}`);
			objects = objects.filter(filter);

			if (!isNaN(id)) {
				object = objects.get(param);
			}
			if (object == null) {
				for (let candidate of objects.array()) {
					if (candidate[name].toLowerCase().match(pattern) != null || candidate.toString().match(pattern) != null) {
						// Calculate the gap between the match.
						var newGap = candidate[name].length - param.length;
						// Only allow smaller gaps or if partial results are not allowed, no gap.
						if (newGap < gap && (allowPartial || gap === 0)) {
							object = candidate;
							gap = newGap;
						}
					}
				}
			}
		}

		return object;
	}

	public readUser(allowPartial = true, filter = () => { return true; }, offset = true) {
		return this.readObject(this.client.users, "username", /<@!?(\d+)>/, allowPartial, filter, offset);
	}

	public readRole(allowPartial = true, filter = () => { return true; }, offset = true) {
		return this.readObject(this.guild.roles, "name", /<@&(\d+)>/, allowPartial, filter, offset);
	}

	public readChannel(allowPartial = true, filter = () => { return true; }, offset = true) {
		return this.readObject(this.guild.channels, "name", /<#(\d+)>/, allowPartial, filter, offset);
	}

	public readMember(allowPartial = true, filter = () => { return true; }, offset = true) {
		return this.readObject(this.guild.members, "displayName", /<@!?(\d+)>/, allowPartial, filter, offset);
	}
}

class Call {
	public readonly TRANSFER_RATE: number = 0.8

	public readonly commands: CommandsManager
	public readonly message: Message
	public readonly params: Params
	public readonly client: Client
	public readonly command: ICommand

	public constructor(commands: CommandsManager, message: Message, params: Params, command: ICommand) {
		this.commands = commands;
		this.message = message;
		this.client = message.client;
		this.params = params;
		this.command = command;
	}

	public requestInput(options: any = null,
		prompt: string = null,
		timeout: number = 180000,
		accepts: any = null): Promise<Params> {
		return new Promise(((resolve, reject) => {
			if (prompt != null)
				this.message.channel.send(prompt);
			if (accepts == null)
				accepts = () => true;

			this.denyInput();
			this.commands._requests.set(this.message.author.id, {
				resolve: resolve,
				reject: reject,
				options: CommandsManager.REQUEST_OPTIONS.isDefined(options) ? options : CommandsManager.REQUEST_OPTIONS.None,
				author: this.message.author.id,
				channel: this.message.channel.id,
				timeout: this.client.setTimeout(() => this.denyInput(), timeout),
				accepts: accepts instanceof RegExp ? (message) => { return accepts.test(message.content); } : accepts
			});
		}).bind(this));
	}

	public denyInput(author: User = this.message.author): void {
		if (this.commands._requests.has(author.id)) {
			var request = this.commands._requests.get(author.id);
			clearTimeout(request.timeout);
			request.reject();
			this.commands._requests.delete(author.id);
		}
	}

	public getWallet(userId = null): WalletAccess {
		return new WalletAccess(userId);
	}

	public safeSend(content?: any,
		message: Message = this.message,
		options: MessageOptions = { reply: this.message.author }): void {
		message.channel.send((content || options), (content != null) ? options : undefined).catch((exc) => {
			message.author.send(`You attempted to use the \`${this.command.id}\` command in ${message.channel}, but I can not chat there.`);
			console.warn(exc.stack);
		});
	}
}

function loadModule(file, category) {
	new Promise((resolve, reject) => {
		try {
			let module: ICommand = require(file);
			if (TESTING || module.test !== true) {
				resolve(module);
			} else {
				throw null;
			}
		} catch (exc) {
			reject(exc);
		}
	}).then((module: ICommand) => {
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

function hasPermissions(command, message) {
	var has = true;
	if (message.guild != null) {
		if (command.botRequires != null)
			has = message.client.requestPermissions(message.guild.members.get(message.client.user.id),
				message.channel,
				command.botRequires,
				command.botRequiresMessage || `To use ${command.id}.`);
		if (has && command.userRequires != null)
			has = message.client.requestPermissions(message.member,
				message.channel,
				command.userRequires,
				command.userRequiresMessage || `To use ${command.id}.`);
	}
	return has;
}

function checkAccess(command, message) {
	var result;
	if (ACCESS.Public.is(command.access)) {
		result = true;
	} else if (ACCESS.Private.is(command.access)) {
		result = message.guild == null;
	} else {
		result = message.guild != null;
	}
	return result;
}

function checkClient(command, message) {
	var result = false;
	var type = (command.userType != null) ? command.userType.toLowerCase() : "both";
	if (type === "user" && !message.author.bot) {
		result = true;
	} else if (type === "bot" && message.author.bot) {
		result = true;
	} else if (type === "both") {
		result = true;
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
				loadModule(file, null);
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

export class CommandsManager implements IExecutable<Message> {
	public static readonly REQUEST_OPTIONS = new Enum(["None", "Anyone", "Cancellable"], { ignoreCase: true });
	public readonly REQUEST_OPTIONS = CommandsManager.REQUEST_OPTIONS;
	public readonly _requests: Collection<string, IRequest> = new Collection()
	public readonly loaded: Collection<string, ICommand> = modules

	getRequesting(message: Message): IRequest {
		var requests = this._requests.filter((request) => request.channel === message.channel.id && request.accepts(message));
		var request: IRequest;
		if (requests.has(message.author.id)) {
			request = requests.get(message.author.id);
		} else if (requests.some((request) => this.REQUEST_OPTIONS.Anyone.is(request.options))) {
			request = requests.find((request) => this.REQUEST_OPTIONS.Anyone.is(request.options));
		}
		return request || null;
	}

	processRequest(request: IRequest, message: Message): boolean {
		clearTimeout(request.timeout);
		if (this.REQUEST_OPTIONS.Cancellable.is(request.options) && message.content.toLowerCase() === "cancel") {
			request.reject();
		} else {
			request.resolve(new Call(this, message, new Params(message), null));
		}
		this._requests.delete(request.author);
		return true;
	}

	processCommand(message: Message): boolean {
		var data = (message.guild || message.channel).data;
		var prefix = message.content.match(new RegExp(util.format(prefixPattern,
			escapeRegExp(data != null ? data.prefix : "/")), "i"));
		var using;
		var used = false;
		if (prefix != null) {
			using = true;
		} else {
			prefix = message.content.match("^" + MessageMentions.USERS_PATTERN.source);
			using = prefix != null &&
				message.mentions.users.size === 1 &&
				message.mentions.users.first().id == message.client.user.id;
		}
		if (using) {
			var params = new Params(message);
			params.offset(prefix[0].length);
			params.readSep();
			var name = params.readParam();
			if (name != null) {
				var command: ICommand = modules.get(name.toLowerCase()) || modules.find((module: ICommand) => module.aliases != null && module.aliases.includes(name));

				if (command != null && checkAccess(command, message) && checkClient(command, message) && hasPermissions(command, message)) {
					if (!server.locked.value || command.id === "lockdown") {
						params.readSep();
						command.execute(new Call(this, message, params, command));
						used = true;
					} else {
						if (!server.locked.channels.includes(message.channel.id)) {
							server.locked.channels.push(message.channel.id);
							message.channel.send("The client is currently in lockdown and inaccessible by any user.");
						}
					}
				}
			}
		}
		return used;
	}

	exec(message: Message): boolean {
		var used;
		var request = this.getRequesting(message);
		if (request != null) {
			if (message.author != message.client.user)
				used = this.processRequest(request, message);
		} else {
			used = this.processCommand(message);
		}
		return used;
	}
};
module.exports = new CommandsManager();
