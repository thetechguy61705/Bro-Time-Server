import { IExecutable, MusicStream, MusicSearchResult } from "types/server";
import { Client, Collection, Snowflake, RichEmbed, Guild, GuildMember, Message, TextChannel, DMChannel, GroupDMChannel, VoiceChannel, VoiceConnection, StreamDispatcher } from "discord.js";
import { Call } from "@server/chat/commands";
import load from "@utility/filesloader";
import StreamCache = require("stream-cache");

var errorHandler = require("@utility/errorHandler");
var config = require("@root/config");

var sort = require("fast-sort/sort");
var sources: Source[] = [];
var tokens: Collection<string, string> = new Collection();
var vote = require("@utility/vote");

// A map from source to token.
const TOKENS_MAPPING = {
	youtube: "GOOGLE"
};
const VOTE_TIMEOUT = 60000;
const VOTE_REQUIRED = 0.30;
const MUSIC_CHANNELS = ["music", "songs"];
const ABANDONED_TIMEOUT = 30000;
const DJ_ROLES = ["330919872630358026", "402175094312665098", "436013049808420866", "436013613568884736", "DJ"];

export type ticket = any;

export interface Source {
	id: string
	test?: boolean
	getTicket: { (queue: string, key?: string): ticket }
	getPlayable: { (ticket: ticket): "good" | "bad" | "mature" | "unkown" }
	loadStream: { (ticket: ticket): MusicStream }
	search: { (query: string, key?: string): Promise<MusicSearchResult[]> }
}

class Queue extends Array<MusicStream> {
	private music: Music
	private connection?: VoiceConnection
	private dispatcher?: StreamDispatcher
	private timer?: NodeJS.Timer
	private loop: number;
	private offset: number;

	public constructor(music: Music, guild: Guild) {
		super();
		this.music = music;
		this.loop = 0;
		this.offset = 0;
		music.players.set(guild.id, this);
	}

	public play(call: Call, stream: MusicStream): void {
		var rStream = new StreamCache() as MusicStream;
		stream.pipe(rStream);
		rStream.url = stream.url;
		rStream.title = stream.title;
		rStream.author = stream.author;

		call.message.channel.send(`Added ${rStream.title} by ${rStream.author} to the queue.`);
		if (this.length === 0)
			this.begin(call, rStream);
		this.push(rStream);
	}

	public stop(): void {
		this.length = 0;
		if (this.dispatcher != null)
			this.dispatcher.end("Finished playing.");
	}

	public skip(): void {
		if (this.dispatcher != null)
			this.dispatcher.end("Skipping song.");
	}

	public isPaused(): boolean {
		var paused = true;
		if (this.dispatcher != null)
			paused = this.dispatcher.paused;
		return paused;
	}

	public toggle(): void {
		if (this.dispatcher != null) {
			if (this.dispatcher.paused) {
				clearTimeout(this.timer);
				this.dispatcher.resume();
			} else {
				this.timer = this.connection.client.setTimeout(this.stop.bind(this), ABANDONED_TIMEOUT);
				this.dispatcher.pause();
			}
		}
	}

	public repeat(call: Call, amount?: number) {
		if (amount == null) {
			this.loop++;
		} else {
			this.loop += amount;
		}
		call.message.channel.send(`Repeating ${this.loop} time${this.loop > 1 ? "s" : ""}.`);
	}

	private begin(call: Call, stream: MusicStream): void {
		if (this.connection != null) {
			this.dispatcher = this.connection.playStream(stream);
			errorHandler(this.dispatcher);
			this.dispatcher.once("end", () => {
				var next = this.getNext();

				if (this.timer != null)
					clearTimeout(this.timer);

				if (next != null) {
					this.begin(call, next);
				} else {
					this.music.players.delete(this.connection.channel.guild.id);
					this.connection.channel.leave();
					call.message.channel.send("Stopped playing music.");
				}
			});
			this.dispatcher.once("start", () => {
				call.message.channel.send(`Now playing ${stream.title} by ${stream.author}!`);
			});
		} else if (call.message.member.voiceChannel != null && Music.isMusicChannel(call.message.member.voiceChannel)) {
			call.message.member.voiceChannel.join().then((connection) => {
				this.connection = connection;
				this.begin(call, stream);
			}, (exc) => {
				call.message.channel.send(exc.message);
				console.warn(exc.stack);
			});
		} else {
			call.message.channel.send("The member is not in a voice channel.");
		}
	}

	private getNext(): MusicStream {
		var result: MusicStream;
		if (this.loop > 0) {
			this.offset++;
			if (this.offset >= this.length) {
				this.loop--;
				this.offset = 0;
			}

			result = this[this.offset];
		} else {
			this.shift();

			if (this.length > 0)
				result = this[0];
		}
		return result;
	}
}

class Music {
	public isDJ: { (member: GuildMember): boolean }
	public players: Collection<Snowflake, Queue>

	public static isDJ(member: GuildMember): boolean {
		return (member.roles.some((role) => DJ_ROLES.includes(role.name) || DJ_ROLES.includes(role.id)))
			|| (member.voiceChannel != null && member.voiceChannel.members.filter((member) => !member.user.bot).size === 1);
	}

	private static request(message: Message, prompt: string): Promise<boolean> {
		var result;
		if (Music.isDJ(message.member)) {
			result = Promise.resolve(true);
		} else {
			var voiceChannel = message.client.voiceConnections.get(message.guild.id).channel;
			if (voiceChannel.members.filter((member) => !member.user.bot).size === 0) {
				result = Promise.resolve(true);
			} else {
				result = vote(VOTE_TIMEOUT, message.channel, Math.floor(voiceChannel.members.size * VOTE_REQUIRED),
					(user) => { return voiceChannel.members.has(user.id); },
					null, prompt, message.author);
			}
		}
		return result;
	}

	public static isMusicChannel(channel: VoiceChannel): boolean {
		var name = channel.name.toLowerCase();
		// todo: Implement music channel restriction option.
		return true || MUSIC_CHANNELS.some((keyword) => { return name.startsWith(keyword) || name.endsWith(keyword); });
	}

	private static sortSearch(query: string, results: MusicSearchResult[]): void {
		query = query.toLowerCase();
		sort(results).desc([
			(result) => { return result.title.toLowerCase().count(query); },
			(result) => { return result.author.toLowerCase().count(query); },
			(result) => { return result.description != null ? result.description.toLowerCase().count(query) : 0; },
			(result) => { return result.tags != null ? result.tags.toLowerCase().count(query) : 0; },
			(result) => { return result.series != null ? result.series.toLowerCase().count(query) : 0; },
			(result) => { return result.source != null ? result.source.toLowerCase().count(query) : 0; }
		]);
	}

	private static async getTicket(query: string, call: Call): Promise<ticket> {
		var ticket;
		for (var source of sources) {
			ticket = await source.getTicket(query, tokens.get(source.id));
			if (ticket != null) {
				Object.defineProperty(ticket, "load", {
					value: source.loadStream.bind(source, ticket)
				});
				break;
			}
		}
		if (ticket == null) {
			var results = [];
			var prompt = new RichEmbed();
			var display = [];
			var choice;
			var result;
			for (let source of sources)
				Array.prototype.push.apply(results, await source.search(query, tokens.get(source.id)));
			Music.sortSearch(query, results);
			results = results.slice(0, 5);

			if (results.length > 0) {
				prompt.setTitle("Pick the closest match (by number):").setColor(0x00AE86);
				// Eventually color should be changable for servers using the future settings command and the database.
				for (let [number, result] of results.entries())
					display.push(`${number + 1} - \`${result.title.substring(0, 300)} by ${result.author.substring(0, 100)}\``);
				prompt.setDescription(display.join("\n")).setDefaultFooter(call.message.author);

				ticket = null;
				try {
					choice = await call.requestInput(call.commands.REQUEST_OPTIONS.Anyone, prompt);
					if (choice != null) {
						choice = choice.params.readNumber();
						if (choice != null) {
							result = results[choice - 1];
							if (result != null)
								ticket = Music.getTicket(result.url, call);
						}
					}
				// eslint-disable-next-line no-empty
				} finally {}
			}
		} else if (!Music.isAcceptable(ticket, source, false, call.message.channel)) {
			ticket = null;
		}
		return ticket;
	}

	private static isAcceptable(ticket: any, source: Source, matureAllowed: boolean, channel: TextChannel | DMChannel | GroupDMChannel): boolean {
		var playable = source.getPlayable(ticket);
		if (playable == "mature" && !matureAllowed)
			channel.send("Mature music is not allowed here.");
		// if (playable == "unknown")
		return playable !== "bad" && (matureAllowed || playable !== "mature");
	}

	public constructor() {
		this.isDJ = Music.isDJ;
		this.players = new Collection();
	}

	public play(call: Call, query: string): void {
		var queue = this.players.has(call.message.guild.id) ?
			this.players.get(call.message.guild.id) :
			new Queue(this, call.message.guild);
		if (query != null) {
			Music.getTicket(query, call).then((ticket) => {
				if (ticket != null) {
					queue.play(call, ticket.load());
				} else {
					call.message.channel.send("Can't find music for the query!");
				}
			});
		} else if (queue.isPaused()) {
			queue.toggle();
		}
	}

	public stop(call: Call): void {
		if (call.client.voiceConnections.has(call.message.guild.id)) {
			Music.request(call.message, "Stop playing music?").then((accepted) => {
				if (accepted) {
					if (this.players.has(call.message.guild.id))
						this.players.get(call.message.guild.id).stop();
				}
			}, (exc) => {
				console.warn(exc.stack);
				call.message.channel.send("Unable to stop playing music (try again shortly).");
			});
		}
	}

	public skip(call: Call): void {
		var queue = this.players.get(call.message.guild.id);
		if (queue != null) {
			Music.request(call.message, "Skip the current song?").then((accepted) => {
				if (accepted)
					queue.skip();
			}, (exc) => {
				console.warn(exc.stack);
				call.message.channel.send("Unable to skip a song (try again shortly).");
			});
		}
	}

	public toggle(call: Call): void {
		var queue = this.players.get(call.message.guild.id);
		if (queue != null) {
			Music.request(call.message, "Pause or resume playing?").then((accepted) => {
				if (accepted)
					queue.toggle();
			}, (exc) => {
				console.warn(exc.stack);
				call.message.channel.send("Unable to toggle music (try again shortly).");
			});
		}
	}

	public repeat(call: Call, amount?: number): void {
		var queue = this.players.get(call.message.guild.id);
		if (queue != null) {
			Music.request(call.message, `Loop ${amount || 1} time${amount != null && amount > 1 ? "s" : ""}?`).then((accepted) => {
				if (accepted)
					queue.repeat(call, amount);
			}, (exc) => {
				console.warn(exc.stack);
				call.message.channel.send("Unable to repeat music (try again shortly).");
			});
		}
	}

	public displayQueued(call: Call) {
		var queue = this.players.get(call.message.guild.id);
		if (queue != null) {
			var info = new RichEmbed();
			var song;
			var songs = [];
			info.setTitle("Queued Music").setColor(0x00AE86);
			for (var order = 0; order < queue.length; order++) {
				song = queue[order];
				songs[order] = `${order + 1} - [${song.title} by ${song.author}](${song.url})`;
			}
			info.setDescription(songs.join("\n"));
			call.message.channel.send(info);
		} else {
			call.message.channel.send("Nothing is queued at the moment.");
		}
	}
}

module.exports = {
	id: "music",
	exec: (client: Client) => {
		load("music", {
			success: (source) => {
				sources.push(source);
			},
			failureMessage: "Unable to load music source."
		});

		for (var [source, key] of Object.entries(TOKENS_MAPPING))
			tokens.set(source, config[key]);
		client.music = new Music();
		client.on("voiceStateUpdate", (oldMember, newMember) => {
			var queue;
			if (newMember.voiceChannel == null) {
				queue = client.music.players.find((queue) => { return queue.connection != null && queue.connection.channel === oldMember.voiceChannel; });
				if (queue != null && !queue.isPaused() && queue.connection.channel.members.every((member) => { return member.user.bot; }))
					queue.toggle();
			} else if (oldMember.voiceChannel == null) {
				queue = client.music.players.find((queue) => { return queue.connection != null && queue.connection.channel === newMember.voiceChannel; });
				if (queue != null && queue.isPaused() && queue.connection.channel.members.every((member) => { return member.user.bot || member === newMember; }))
					queue.toggle();
			}
		});
	}
} as IExecutable<Client>;
