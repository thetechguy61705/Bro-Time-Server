var errorHandler = require("@utility/errorHandler");
var config = require("@root/config");
var { Collection, RichEmbed } = require("discord.js");
var fs = require("fs");
var sources = [];
var tokens = new Collection();
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

class Queue extends Array {
	constructor(music, guild) {
		super();
		this.music = music;
		music.players.set(guild.id, this);
	}

	play(stream, call) {
		call.message.channel.send(`Added ${stream.title} by ${stream.author} to the queue.`);
		if (this.length === 0)
			this.begin(stream, call);
		this.push(stream);
	}

	stop() {
		this.length = 0;
		if (this.dispatcher != null)
			this.dispatcher.end("Finished playing.");
	}

	skip() {
		if (this.dispatcher != null)
			this.dispatcher.end("Skipping song.");
	}

	isPaused() {
		var paused = true;
		if (this.dispatcher != null)
			paused = this.dispatcher.paused;
		return paused;
	}

	toggle() {
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

	begin(stream, call) {
		if (this.connection != null) {
			this.dispatcher = this.connection.playStream(stream);
			errorHandler(this.dispatcher);
			this.dispatcher.on("end", () => {
				this.shift();
				if (this.timer != null)
					clearTimeout(this.timer);
				if (this.length > 0) {
					this.begin(this[0], call);
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
				this.begin(stream, call);
			}, (exc) => {
				call.message.channel.send(exc.message);
				console.warn(exc.stack);
			});
		} else {
			call.message.channel.send("The member is not in a voice channel.");
		}
	}
}

class Music {
	static isDJ(member) {
		return (member.roles.some((role) => DJ_ROLES.includes(role.name) || DJ_ROLES.includes(role.id)))
			|| (member.voiceChannel != null && member.voiceChannel.members.filter((member) => !member.user.bot).size === 1);
	}

	static request(message, prompt) {
		var result;
		if (Music.isDJ(message.member)) {
			result = Promise.resolve(true);
		} else {
			var voiceChannel = message.client.voiceConnections.get(message.guild.id).channel;
			if (voiceChannel.members.filter((member) => { return !member.user.bot; }).size() == 0) {
				result = Promise.resolve(true);
			} else {
				result = vote(VOTE_TIMEOUT, message.channel, Math.floor(voiceChannel.members.size * VOTE_REQUIRED),
					(user) => { return voiceChannel.members.has(user.id); },
					null, prompt, message.user);
			}
		}
		return result;
	}

	static isMusicChannel(channel) {
		var name = channel.name.toLowerCase();
		return MUSIC_CHANNELS.some((keyword) => { return name.startsWith(keyword) || name.endsWith(keyword); });
	}

	static compareSearchResults() {
		return 0;
	}

	static async getTicket(query, call) {
		var ticket;
		for (var source of sources) {
			ticket = await source.getTicket(query, tokens.get(source.id));
			if (ticket != null) {
				Object.defineProperty(ticket, "load", {
					value: source.load.bind(source, ticket)
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
			results.sort(Music.compareSearchResults);
			results = results.slice(0, 5);

			if (results.length > 0) {
				prompt.setTitle("Pick the closest match (by number):").setColor(0x00AE86);
				// Eventually color should be changable for servers using the future settings command and the database.
				for (let [number, result] of results.entries())
					display.push(`${number + 1} - \`${result.display.substring(0, 300)}\``);
				prompt.setDescription(display.join("\n")).setDefaultFooter(call.message.author);

				ticket = null;
				try {
					choice = await call.requestInput(call.commands.REQUEST_OPTIONS.Anyone, prompt);
					if (choice != null) {
						choice = choice.params.readNumber();
						if (choice != null) {
							result = results[choice - 1];
							if (result != null)
								ticket = Music.getTicket(call.client, call.message.channel, result.query);
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

	static isAcceptable(ticket, source, matureAllowed, channel) {
		var playable = source.getPlayable(ticket);
		if (playable == "mature" && !matureAllowed)
			channel.send("Mature music is not allowed here.");
		// if (playable == "unknown")
		return playable !== "bad" && (matureAllowed || playable !== "mature");
	}

	constructor(client) {
		this.isDJ = Music.isDJ;
		this.players = new Collection();
		this.client = client;
	}

	play(query, call) {
		var queue = this.players.has(call.message.guild.id) ?
			this.players.get(call.message.guild.id) :
			new Queue(this, call.message.guild);
		if (query != null) {
			Music.getTicket(query, call).then((ticket) => {
				if (ticket != null) {
					queue.play(ticket.load(), call);
				} else {
					call.message.channel.send("Can't find music for the query!");
				}
			});
		} else if (queue.paused) {
			queue.resume();
		}
	}

	stop(call) {
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

	skip(call) {
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

	toggle(call) {
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

	repeat() {
	}
}

for (let file of fs.readdirSync(__dirname + "/../music")) {
	let match = file.match(/^(.*)\.js$/);
	if (match != null) {
		new Promise((resolve, reject) => {
			try {
				resolve(require("@server/music/" + match[1]));
			} catch (exc) {
				reject(exc);
			}
		}).then((source) => {
			sources.push(source);
		}, (exc) => {
			console.warn(`Unable to load music source ${match}:`);
			console.warn(exc.stack);
		});
	}
}

module.exports = {
	id: "music",
	exec: (client) => {
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
};
