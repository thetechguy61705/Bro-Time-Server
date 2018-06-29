var { Message, TextChannel } = require("discord.js");
var emojiRegex = require("emoji-regex")();

const CHANNEL_NAME = "emoji-only";
const SPACE = /\s+/y;
const UNICODE_EMOJI = new RegExp(emojiRegex, "y");
const DISCORD_EMOJI = /<a?:(\w+):(\d+)>/yu;
const EMOJI_TESTS = [
	(content, index) => {
		SPACE.lastIndex = index;
		var match = SPACE.exec(content);
		return match != null ? match[0].length : null;
	},
	(content, index) => {
		UNICODE_EMOJI.lastIndex = index;
		var match = UNICODE_EMOJI.exec(content);
		return match != null ? match[0].length : null;
	},
	(content, index, client) => {
		DISCORD_EMOJI.lastIndex = index;
		var match = DISCORD_EMOJI.exec(content);
		return (match != null && client.emojis.some((emoji) => emoji.id === match[2])) ? match[0].length : null;
	}
];

function handleMessage(message) {
	var content = message.content;
	var result;
	var index = 0;
	var isValid = true;

	do {
		for (var test of EMOJI_TESTS) {
			result = test(content, index, message.client);
			if (result != null)
				break;
		}
		if (result != null) {
			index += result;
		} else {
			isValid = false;
		}
	} while (isValid && index < content.length);

	if (!isValid)
		message.delete();
}

module.exports = {
	load: function(client) {
		client.on("messageUpdate", this.exec);
	},

	exec: function(message, newMessage) {
		if (newMessage instanceof Message)
			message = newMessage;

		if (message.channel instanceof TextChannel && message.channel.name === CHANNEL_NAME && message.deletable) {
			handleMessage(message);
		}
	}
};
