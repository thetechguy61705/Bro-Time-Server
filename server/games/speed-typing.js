/*
const { Attachment } = require("discord.js");
const textToPNG = require("text2png");
const randomWords = require("random-words");


function splitArray(arr) {
	var newArr = [];
	do {
		newArr.push(arr.splice(0, 5));
	} while (arr.length > 0);
}
*/

module.exports = {
	id: "speed-typing",
	aliases: "typing",
	shortDescription: "Race someone by typing fast!",
	instructions: "Type the text shown in the image as fast as possible",
	betting: true,
	minPlayers: 2,
	maxPlayers: 2,
	requiresInvite: true,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		session.endGame();
		// if (session.context.channel.permissionsFor(session.client).has("ATTACH_FILES")) {
		//	session.players.set(session.host.id, session.host);
		//	var words = randomWords({ exactly: 20, maxLength: 16, formatter: (word) => { return word.toUpperCase(); }}).join(" ");
		//	var image = textToPNG(splitArray.map((a) => a.join(" ")).join("\n"), { font: "20px Merriweather", padding: 3 });
		//	var text = words.join(" ");
		//	session.context.channel.send("Game starting in **3**.").then((msg) => {
		//		var interval = session.client.setInterval(() => {
		//			if (Number(msg.content.match(/\*\*\d\*\*/)[0]) !== 1) {
		//				msg.edit(`Game starting in **${Number(msg.content.match(/\*\*\d\*\*/)[0]) - 1}**`);
		//			} else {
		//				call.client.clearInterval(interval);
		//				msg.edit("GAME STARTED (this game is case insensitive). TWO MINUTES.", { attachment: new Attachment(image) }).then(() => {
		//					msg.channel.awaitMessages((m) => session.players.keyArray().includes(m.author.id) &&
		//						m.content.toUpperCase() === words,
		//						{ time: 120000, maxMatches: 1, errors: ["time"] }).then((results) => {
		//							session.winner = results[0].author;
		//							session.endGame();
		//						});
		//				});
		//			}
		//		}, 1000);
		//	});
		// } else session.context.channel.send("I don't have the permission to attach files to my messages in this channel. Please enable it to play this game.");
	},
	input: () => { return false; },
	end: (session) => {
		session.context.channel.send(`${session.winner || "Nobody"} won the game!`);
	},
};
