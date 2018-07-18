const { RichEmbed } = require("discord.js");
const randomWords = require("random-words");
const math = require("mathjs");
const UNICODE_CHARS = [
	"Ａ", "Ｂ", "Ｃ",
	"Ｄ", "Ｅ", "Ｆ",
	"Ｇ", "Ｈ", "Ｉ",
	"Ｊ", "Ｋ", "Ｌ",
	"Ｍ", "Ｎ", "Ｏ",
	"Ｐ", "Ｑ", "Ｒ",
	"Ｓ", "Ｔ", "Ｕ",
	"Ｖ", "Ｗ", "Ｘ",
	"Ｙ", "Ｚ", " "
];
const NORMAL_CHARS = Object.keys(require("@utility/alphaNumericChars.ts").ALPHABET).concat(" ");

function unicodeText(str) {
	var newStr = str;
	for (let i = 0; i < str.length; i++) {
		let char = str.charAt(i);
		newStr = newStr.replace(new RegExp(char, "i"), UNICODE_CHARS[NORMAL_CHARS.indexOf(char)]);
	}
	return newStr;
}

module.exports = {
	id: "speed-typing",
	aliases: "typing",
	shortDescription: "Race people by typing fast!",
	instructions: "Type the text shown in the image as fast as possible",
	betting: true,
	minPlayers: 1,
	maxPlayers: 5,
	requiresInvite: true,
	allowLateJoin: false,
	inviteTime: 60000,
	load: () => {},
	start: (session) => {
		session.players.set(session.host.id, session.host);
		var words = randomWords({ exactly: 20, maxLength: 16, formatter: (word) => { return word.toUpperCase(); }});
		session.letters = words.map((word) => word.length).reduce((a, b) => a += b);
		var unicodeWords = words.map((word) => { return unicodeText(word); });
		var i = 3;
		session.context.channel.send(`Game starting in **${i}**.`).then((msg) => {
			var interval = session.context.client.setInterval(() => {
				i -= 1;
				if (i !== 0) {
					msg.edit(`Game starting in **${i}**`);
				} else {
					session.context.client.clearInterval(interval);
					var startedAt = Date.now();
					msg.edit("", {
						embed: new RichEmbed()
							.setColor(0x00AE86)
							.setTitle("Rewrite the words in one message and send it to this channel.")
							.setDescription(`\`\`\`${unicodeWords.join("\n")}\`\`\``)
					}).then(() => {
						msg.channel.awaitMessages((m) => session.players.keyArray().includes(m.author.id) &&
							m.content.toUpperCase() === words.join(" "),
						{ time: 120000, maxMatches: 1, errors: ["time"] }).then((results) => {
							session.winner = results.first().author;
							session.timeTaken = Date.now() - startedAt;
							session.endGame();
						});
					});
				}
			}, 1000);
		});
	},
	input: () => { return false; },
	end: (session) => {
		var timeTaken = session.timeTaken / 1000;
		if (session.winner != null) {
			session.context.channel.send(`${session.winner} won the game! It took ${Math.round(timeTaken)} seconds for them to finish. ` +
				`${math.round((20 / timeTaken) * 60, 2)} WPM (words per minute). ` +
				`${math.round((session.letters / timeTaken) * 60, 2)} CPM (characters per minute).`);
		} else {
			session.context.channel.send("Nobody won the game; the time ran out.");
		}
	},
};
