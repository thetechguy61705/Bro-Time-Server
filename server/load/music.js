var { Collection } = require("discord.js");
var tokens = new Collection();
var vote = require("app/vote");

// A map from source to token.
const TOKENS_MAPPING = {
	youtube: "google"
};
const VOTE_TIMEOUT = 60000;
const VOTE_REQUIRED = 0.30;
const MUSIC_CHANNELS = ["music", "songs"];

class Queue {
	static isDj(member) {
		const premiumRoles = ["330919872630358026", "402175094312665098", "436013049808420866", "436013613568884736", "DJ"];
		var autoAllow = false;
		if (member.roles.some(role => premiumRoles.includes(role.name) || premiumRoles.includes(role.id))) {
			autoAllow = true;
		} else if (member.voiceChannel != null) {
			if (member.voiceChannel.members.filter(member => !member.user.bot).size === 1)
				autoAllow = true;
		}
		return autoAllow;
	}

	static request(message, prompt) {
		var result;
		if (Queue.isDJ(message.member)) {
			result = Promise.resolve(true);
		} else {
			var voiceChannel = message.member.voiceChannel;
			result = vote(VOTE_TIMEOUT, message.channel, Math.floor(voiceChannel.members.size*VOTE_REQUIRED),
				(user) => { return voiceChannel.members.has(user.id); },
				null, prompt, message.user);
		}
		return result;
	}

	static isMusicChannel(channel) {
		var name = channel.name.toLowerCase();
		return MUSIC_CHANNELS.some((keyword) => { return name.startsWith(keyword) || name.endsWith(keyword); });
	}

	constructor() {
		this.players = new Collection();
	}

	play(query, message, client) {
		this.reserve(message.member, client).then(() => {
			console.log("Playing:", query);
		}, () => {
			console.log("Can't play!");
		});
	}

	stop(message) {
		Queue.request(message, "Stop playing music?").then((accepted) => {
			this.release(message.member.guild).then(() => {
				if (accepted)
					message.channel.send("Stopped playing music.");
			});
		}, (exc) => {
			console.warn(exc.stack);
			message.channel.send("Unable to stop playing music (try again shortly).");
		});
	}

	skip() {

	}

	repeat() {

	}

	reserve(member) {
		return new Promise((resolve, reject) => {
			if (!this.players.has(member.guild.id)) {
				if (member.voiceChannel != null && Queue.isMusicChannel(member.voiceChannel)) {
					member.voiceChannel.join().then((connection) => {
						this.players.set(member.voiceChannel.guild.id, connection);
						resolve(true);
					}).catch(reject);
				} else {
					reject(new Error("The member is not in a voice channel."));
				}
			} else {
				resolve(true);
			}
		});
	}

	release(guild) {
		return new Promise((resolve) => {
			if (this.players.has(guild.id)) {
				this.players.get(guild.id).channel.leave();
				this.players.delete(guild.id);
			}
			resolve();
		});
	}

	pause() {

	}
}

module.exports = {
	exec: (client, bot) => {
		var botTokens = new Collection();
		for (var [source, key] of Object.entries(TOKENS_MAPPING)) {
			botTokens.set(source, bot[key]);
		}
		tokens.set(client.user.id, botTokens);
		client.music = new Queue();

		/* client.on("message", (message) => {
			if (message.content == "reserve") {
				client.music.reserve(message.member);
			} else if (message.content == "release") {
				client.music.release(message.member);
			}
		}); */
	}
};
