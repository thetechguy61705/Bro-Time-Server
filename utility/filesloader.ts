import { Client } from "discord.js";

const defaults = require("defaults");
const fs = require("fs");

const OPTION_DEFAULTS = {
	displayErrorStack: true,
	predicate: () => true
} as ILoadOptions;

export interface ILoadOptions {
	client?: Client
	displayErrorStack?: boolean
	success?: { (exported: any, file: string): void }
	failure?: { (exc: Error, file: string): void }
	failureMessage?: string
	timeoutTime?: number
	timeout?: { (exc: Error): void }
	timeoutMessage?: string
	predicate?: { (exported: any, file: string): boolean }
}

export function load(path: string, options: ILoadOptions): Promise<any[]> {
	var tasks = [];
	var exts = Object.keys(require.extensions);

	defaults(options, OPTION_DEFAULTS);
	for (let file of fs.readdirSync(`${__dirname}/../server/${path}`)) {
		if (exts.some((ext) => file.endsWith(ext))) {
			let task = new Promise(async (resolve, reject) => {
				var finished = false;
				if (options.timeout != null) {
					options.client.setTimeout(() => {
						if (!finished) {
							finished = true;
							var exc = new Error(`Loader for ${file} took too long to load.`);
							if (options.timeoutMessage != null)
								console.warn(options.timeoutMessage);
							if (options.displayErrorStack)
								console.warn(exc.stack);
							if (options.timeout != null)
								options.timeout(exc);
							reject();
						}
					}, options.timeoutTime);
				}

				try {
					var exported = require(`@server/${path}/${file}`);
					if (options.predicate(exported, file)) {
						if (exported.load != null) {
							var promise = exported.load(options.client);
							if (promise != null)
								await promise;
						}
						if (options.success != null)
							options.success(exported, file);
					}
					finished = true;
					resolve();
				} catch (exc) {
					finished = true;
					if (options.failureMessage != null)
						console.warn(options.failureMessage);
					if (options.displayErrorStack)
						console.warn(exc.stack);
					if (options.failure != null)
						options.failure(exc, file);
					reject();
				}
			});

			tasks.push(task);
		}
	}

	return Promise.all(tasks);
}
