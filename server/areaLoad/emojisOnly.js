var { Guild, TextChannel, Permissions } = require("discord.js");
var channels = [];
var listenersAdded = false;

const CHANNEL_NAME = "emoji-only";
const RANGES = [
	{ min: 2194, max: 2199 } // left-right arrow..down-left arrow
];
const EMOTICONS = [
	":D"
]

function addChannel(channel) {
	channels.push(channel);
}

function removeChannel(channel) {
	var index = channels.indexOf(channel);
	if (index >= 0)
		channels.splice(index, 1);
}

function isValid(char) {
	var result = false;
	for (var range of RANGES) {
		if (char >= range.min && char <= range.max) {
			result = true;
			break;
		}
	}
	return result;
}

function onMessage(message) {
	if (channels.includes(message.channel) &&
		(message.guild == null ||
			message.channel.permissionsFor(message.guild.members.get(message.client.user.id)).has(Permissions.FLAGS.MANAGE_MESSAGES))) {
		var content = message.content;
		var isInvalid = true;
		for (var pos = 0; pos < content.length; pos++) {
			if (isValid(content[pos])) {
				isInvalid = false;
				break;
			}
		}
		if (isInvalid)
			isInvalid = !EMOTICONS.includes(content);
		if (isInvalid)
			message.delete();
	}
}

module.exports = {
	id: "emojisOnly",
	exec(area, client) {
		if (!listenersAdded) {
			listenersAdded = true;
			client.on("channelDelete", removeChannel);
			client.on("message", onMessage);
		}
		if (area instanceof Guild) {
			for (var channel of area.channels.values())
				this.exec(channel, client);
		} else if (area instanceof TextChannel && area.name === CHANNEL_NAME)
			addChannel(area);
	}
};
