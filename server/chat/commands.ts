import { Channel, Role, Permissions, Message, Client, Guild, Collection, MessageMentions, User, PermissionResolvable } from "discord.js";
import { Wallet } from "@utility/wallet.ts";
import { DiscordResolvable, IExecutable, ILoadable } from "types/server";
import { DataRequest } from "@utility/datarequest";
import load from "@utility/filesloader";
import * as server from "@server/server";
import * as escapeRegExp from "@utility/escapeRegexp";
import * as fs from "fs";

const LOAD_TIMEOUT = 60000;
const TESTING = process.env.NODE_ENV !== "production";
const ACCESS = new Enum(["Public", "Private", "Server"], { ignoreCase: true });
const SPACE = "\\s,";
const QUOTES = "\"'";

for (let file of fs.readdirSync(`${__dirname}/../commands`)) {
	if (!file.includes(".")) {
		for (let subFile of fs.readdirSync(`${__dirname}/../commands/${file}`)) {
			require(`@server/commands/${file}/${subFile}`)["category"] = file;
			require(`@server/commands/${file}/${subFile}`)["file"] = subFile;
		}
	} else {
		require(`@server/commands/${file}`)["category"] = "Other";
		require(`@server/commands/${file}`)["file"] = file;
	}
}

export interface ICommand extends IExecutable<Call> {
	readonly id: string
	readonly test?: boolean
	readonly aliases?: string[]
	readonly description?: string
	readonly paramsHelp?: string
	readonly params?: {
		type: string | Function,
		failure?: string | Function,
		greedy: boolean,
		required: boolean,
		default?: any
	}[]
	readonly access?: string | number
	readonly userType?: string | number
	readonly userRequires?: PermissionResolvable | PermissionResolvable[]
	readonly userRequiresMessage?: string | string[]
	botRequires?: PermissionResolvable | PermissionResolvable[]
	botRequiresMessage?: string | string[]
	readonly restrictions?: {
		servers?: DiscordResolvable<Guild>[],
		channels?: DiscordResolvable<Channel>[],
		roles?: DiscordResolvable<Role>[],
		permissions?: DiscordResolvable<Permissions>[]
	}[]
	category?: string
	file?: string
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
				[value] = match;
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
				[value] = match;
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
				[value] = match;
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

export class Call {
	public readonly TRANSFER_RATE: number = 0.8

	public readonly commands: CommandsManager
	public readonly message: Message
	public readonly params: Params
	public readonly client: Client
	public readonly command: ICommand
	public parameters: any[]

	public constructor(commands: CommandsManager, message: Message, params: Params, command: ICommand) {
		this.commands = commands;
		this.message = message;
		this.client = message.client;
		this.params = params;
		this.command = command;
	}

	public requestInput(options: any = null,
		prompt: any = null,
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

	public getWallet(userId = null): Wallet {
		return new Wallet(userId);
	}

	public safeSend(msg, content = "", options = { reply: msg.author || this.message.author }): void {
		if (typeof content !== "string") {
			options = content;
			content = "";
		}
		if (typeof msg === "string") {
			content = msg;
			msg = this.message;
		} else if (!(msg instanceof Message)) {
			options = msg;
			msg = this.message;
		}
		msg.channel.send.call(msg.channel, content, options).catch((exc: Error) => {
			msg.author.send(`You attempted to use the \`${this.command.id}\` command in ${msg.channel}, but I can not chat there.`);
			console.warn(exc.stack);
		});
	}
}

export class CommandsManager implements IExecutable<Message>, ILoadable<Client> {
	public static readonly REQUEST_OPTIONS = new Enum(["None", "Anyone", "Cancellable"], { ignoreCase: true });
	public readonly REQUEST_OPTIONS = CommandsManager.REQUEST_OPTIONS;
	public readonly _requests: Collection<string, IRequest> = new Collection()
	public loaded: Collection<string, ICommand> = new Collection<string, ICommand>()

	public onFailure(call: Call, param): void {
		if (typeof param.failure === "string")
			call.safeSend(param.failure);
		else if (typeof param.failure === "function")
			param.failure(call.message);
		else call.safeSend("Invalid parameter type supplied.");
	}

	public async runParams(call): Promise<any> {
		if (call.command.params) {
			var result = [];
			for (let test of call.command.params) {
				var param;
				if (!test.type|| test.type === "any")
					param = call.params.readParam(test.greedy, test.required);
				else if (test.type === "number")
					param = call.params.readNumber(test.required);
				else if (test.type === "member") {
					await call.message.guild.fetchMembers("", call.message.guild.memberCount);
					param = call.params.readMember(test.required);
				} else if (typeof test.type === "function") {
					try {
						if (call.params.readParam(test.greedy, false))
							param = await test.type(call.params.readParam(test.greedy, test.required), call);
					} catch (exc) {
						param = null;
						console.warn(exc.stack);
					}
				} else if (test.type instanceof RegExp)
					param = (call.params.readParam(test.greedy, test.required) || { match: () => null }).match(test.type);
				if (param != null || !test.required) {
					if (param != null && !test.required) call.params.offset(`${param}`.length + 1);
					if (param == null && !test.required && test.default) {
						if (typeof test.default !== "function")
							param = test.default;
						else param = test.default(call);
					}
					result.push(param);
				} else {
					result.push(null);
					return this.onFailure(call, test);
				}
			}
			call.parameters = result;
			call.command.exec(call);
		} else call.command.exec(call);
	}

	public async load(client: Client) {
		load("commands", {
			client: client,
			success: (exported) => {
				exported = exported.default || exported;
				this.loaded.set(exported.id, exported);
				if (exported.category === "Kitchen") require("@server/load/orders.js").storedCommands.set(exported.id, exported);
			},
			failure: (exc, file) => {
				console.warn(`Command failed to load (${file}):`);
				console.warn(exc.stack);
			},
			timeoutTime: LOAD_TIMEOUT,
			predicate: (exported: ICommand): boolean => {
				return TESTING || !exported.test;
			}
		});
	}

	public exec(message: Message): boolean {
		var request = this.getRequesting(message);
		if (request != null) {
			if (message.author != message.client.user)
				this.processRequest(request, message);
		} else {
			this.processCommand(message);
		}
		return true;
	}

	private getRequesting(message: Message): IRequest {
		var requests = this._requests.filter((request) => request.channel === message.channel.id && request.accepts(message));
		var request: IRequest;
		if (requests.has(message.author.id)) {
			request = requests.get(message.author.id);
		} else if (requests.some((request) => this.REQUEST_OPTIONS.Anyone.is(request.options))) {
			request = requests.find((request) => this.REQUEST_OPTIONS.Anyone.is(request.options));
		}
		return request || null;
	}

	private processRequest(request: IRequest, message: Message): void {
		clearTimeout(request.timeout);
		if (this.REQUEST_OPTIONS.Cancellable.is(request.options) && message.content.toLowerCase() === "cancel") {
			request.reject();
		} else {
			request.resolve(new Call(this, message, new Params(message), null));
		}
		this._requests.delete(request.author);
	}

	private async processCommand(message: Message): Promise<void> {
		var prefix = await DataRequest.getPrefix(message.guild != null ? message.guild.id : null);
		var using = false;
		if (message.content.startsWith(prefix)) {
			using = true;
		} else {
			var match = message.content.match("^" + MessageMentions.USERS_PATTERN.source);
			if (match != null) {
				[prefix] = match;
				using = message.mentions.users.size === 1 &&
					message.mentions.users.first().id == message.client.user.id;
			}
		}

		if (using) {
			var params = new Params(message);
			params.offset(prefix.length);
			params.readSep();
			var name = params.readParam();
			if (name != null) {
				var command: ICommand = this.loaded.get(name.toLowerCase()) ||
				this.loaded.find((module: ICommand) => module.aliases != null && module.aliases.includes(name));

				if (command != null && this.checkAccess(command, message)) {
					if (!server.locked.value || command.id === "lockdown") {
						params.readSep();
						this.runParams(new Call(this, message, params, command));
					} else {
						if (!server.locked.channels.includes(message.channel.id)) {
							server.locked.channels.push(message.channel.id);
							message.channel.send("The client is currently in lockdown and inaccessible by any user.");
						}
					}
				}
			}
		}
	}

	public async checkAccess(command: ICommand, message: Message): Promise<boolean> {
		var result: boolean;
		if (ACCESS.Public.is(command.access)) {
			result = true;
		} else if (ACCESS.Private.is(command.access)) {
			result = message.guild == null;
		} else {
			result = message.guild != null;
		}

		if (result)
			result = await this.checkPermissions(command, message);

		if (result)
			result = await this.checkRestrictions(command, message);

		return result;
	}

	private async checkPermissions(command: ICommand, message: Message): Promise<boolean> {
		var result: boolean = true;
		if (message.guild != null) {
			if (command.botRequires != null)
				result = message.client.requestPermissions(message.guild.members.get(message.client.user.id),
					message.channel,
					command.botRequires,
					command.botRequiresMessage || `To use ${command.id}.`);
			if (result && command.userRequires != null)
				result = message.client.requestPermissions(message.member,
					message.channel,
					command.userRequires,
					command.userRequiresMessage || `To use ${command.id}.`);
		}
		return result;
	}

	// eslint-disable-next-line no-unused-vars
	private async checkRestrictions(_command: ICommand, _message: Message): Promise<boolean> {
		var result: boolean = true;

		// todo: Check command restrictions.

		if (!result) {
			// todo: Check database restrictions.
		}

		return result;
	}
}
module.exports = new CommandsManager();
