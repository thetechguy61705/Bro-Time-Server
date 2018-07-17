const { Message } = require("discord.js");
const escapeRegExp = require("escape-string-regexp");
const normalizeString = require("normalize-strings");
const isModerator = require("@utility/moderator");
const { ALPHABET, NUMBERS } = require("@utility/alphaNumericChars.ts");
const GUILDS = require("@server/server").guilds;
const INVITE_REGEX = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/\w+/gi;
const URL_REGEX = /(https?:\/\/(www\.)?)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/gi;
const MARKDOWN = /(`|\*|_|~)+/g;

function getKeyByValue(object, value) {
	return Object.keys(object).find((key) => object[key] === value);
}

function specialCharsToLetters(str) {
	var newStr = str
		.replace(/0|(\(\))/g, "O")
		.replace(/1|\|/g, "I")
		.replace(/3/g, "E")
		.replace(/4|@/g, "A")
		.replace(/5/g, "S")
		.replace(/6|8/g, "B")
		.replace(/9/g, "G")
		.replace(/\[^A-Z]/gi, "");
	return newStr;
}

module.exports = {
	INVITE_REGEX: INVITE_REGEX,
	MARKDOWN_REGEX: MARKDOWN,

	checks: [
		function(message) {
			if (!(message.channel.topic || "").includes("<ignore-bad>")) {
				const BAD_WORDS = ["-".repeat(2001)];
				// Currently settings/preferences is not available, until then bad words will be an impossible string to create, do to discord message limitations.
				const BAD_WORDS_REGEX = new RegExp(`(${BAD_WORDS.map((word) => escapeRegExp(word)).join(")|(")})`, "gi");
				var cleanedContent = message.content.toUpperCase();
				var emojis = message.content.match(new RegExp(require("emoji-regex")(), "g"));
				var nums = message.content.match(new RegExp(`(${Object.values(NUMBERS).join(")|(")})`, "g"));
				for (let num of nums || []) {
					cleanedContent = cleanedContent.replace(num, getKeyByValue(NUMBERS, num) || num);
				}
				for (let emoji of emojis || []) {
					cleanedContent = cleanedContent.replace(emoji, getKeyByValue(ALPHABET, emoji) || emoji);
				}
				cleanedContent = normalizeString(cleanedContent.replace(MARKDOWN, ""));
				var cursed = BAD_WORDS_REGEX.test(cleanedContent) ||
					BAD_WORDS_REGEX.test(cleanedContent.replace(/\s+/g, "")) ||
					BAD_WORDS_REGEX.test(specialCharsToLetters(cleanedContent)) ||
					BAD_WORDS_REGEX.test(specialCharsToLetters(cleanedContent).replace(/\s+/g, ""));
				if (cursed) {
					return "Please don't send blocked words.";
				}
			}
		},
		function(message) {
			return false;
			// Currently disabled because this requires settings.
			// eslint-disable-next-line no-unreachable
			if (!(message.channel.topic || "").includes("<ignore-url>") && !isModerator(message.member) && URL_REGEX.test(message.content)) {
				return "Please do not send links.";
			}
		},
		async function(message) {
			if (!(message.channel.topic || "").includes("<ignore-invite>")) {
				var invites = message.content.replace(MARKDOWN, "").match(INVITE_REGEX);

				if (invites != null) {
					for (let possibleInvite of invites) {
						try {
							var invite = await message.client.fetchInvite(possibleInvite);
							if (invite != null && invite.guild.id !== message.guild.id && !isModerator(message.member)) {
								if (GUILDS.includes(message.guild.id)) {
									if (!GUILDS.includes(invite.guild.id)) {
										return "Please do not send invite links to other Discord servers.";
									}
								} else {
									return "Please do not send invite links to other Discord servers.";
								}
							}
						} catch (exc) {
							if (!exc.message.startsWith("Unknown Invite") && !exc.message.startsWith("404: Not Found"))
								console.warn(exc.stack);
						}
					}
				}
			}
		}
	],
	load: function(client) {
		client.on("messageUpdate", this.exec);
	},
	exec: async function(message, newMessage) {
		if (newMessage instanceof Message)
			message = newMessage;

		if (message.deletable && message.channel.type === "text" && message.author.id !== message.client.user.id) {
			for (let check of module.exports.checks) {
				var result = await check(message);
				if (result) {
					if (!message.deleted) message.delete().catch((exc) => {
						if (!exc.message.includes("Unknown Message")) console.warn(exc.stack);
					});
					message.reply(result).then((msg) => {
						msg.client.setTimeout(() => {
							if (!msg.deleted) msg.delete().catch((exc) => {
								if (!exc.message.includes("Unknown Message")) console.warn(exc.stack);
							});
						}, 3000);
					});
					break;
				}
			}
		}
	}
};
