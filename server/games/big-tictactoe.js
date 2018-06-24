const { Collection } = require("discord.js");

function getBoard(eA) {
	return `${eA[0]} | ${eA[1]} | ${eA[2]} | ${eA[3]}\n` +
		"—————————-" +
		`\n${eA[4]} | ${eA[5]} | ${eA[6]} | ${eA[7]}\n` +
		"—————————-" +
		`\n${eA[8]} | ${eA[9]} | ${eA[10]} | ${eA[11]}\n` +
		"—————————-" +
		`\n${eA[12]} | ${eA[13]} | ${eA[14]} | ${eA[15]}`;
}
// Creates the tictactoe board.

function arrayToCollection(arr) {
	var newColl = new Collection();
	for (let i = 0; i < arr.length; i++) {
		newColl.set(i, arr[i]);
	}
	return newColl;
}


module.exports = {
	id: "big-tictactoe",
	shortDescription: "Play a larger version of tictactoe.",
	longDescription: "Play big tictactoe, where the goal is to get 3 of your X / O in a row.",
	instructions: "React with the emoji corresponding to the grid square you wish to put your X / O in.",
	betting: true,
	minPlayers: 2,
	maxPlayers: 2,
	requiresInvite: true,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		const customEmojis = ["eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "💣"]
			.map((emoji) => (session.context.client.guilds.get("453694109819994114").emojis.find((e) => e.name === emoji) || emoji));
		// Merges custom emojis with actual ones.
		const E_A = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟"].concat(customEmojis)
		// This array is modified to change to the number to the users emoji (X or O)
		const author = session.host;
		const target = session.players.last();
		session.players.set(session.host.id, session.host);
		var awaiting = false;
		var turn = [author, "❌"];
		session.context.channel.send(getBoard(E_A) + "\n\n" + turn[0] + "'s turn.").then(async (msg) => {
			session.bigTictactoe = msg;
			await msg.reactMultiple(E_A);
			const filter = (reaction, user) => [author.id, target.id].includes(user.id) && (E_A.includes(reaction.emoji.name) || E_A.map((e) => e.id).includes(reaction.emoji.id));
			const reactions = msg.createReactionCollector(filter, { time: 300000 });
			session.collector = reactions;
			reactions.on("collect", (reaction) => {
				if (reaction.users.last().id === turn[0].id && !awaiting) {
					if (reaction.emoji.name !== "💣") {
						for (let emoji of E_A) {
							if (emoji === reaction.emoji.name || emoji.id === reaction.emoji.id) {
								E_A.splice(E_A.indexOf(emoji), 1, turn[1]);
								// Changes the index of the number they select to their emoji (X or O)
							}
						}

						turn = (turn[0].id === target.id) ? [author, "❌"] : [target, "⭕"];

						msg.edit(getBoard(E_A)+ "\n\n" + turn[0] + "'s turn.").then((newMsg) => {
							session.bigTictactoe = newMsg;
							var E_A_COLL = arrayToCollection(E_A);
							for (let [index, emoji] of E_A_COLL) {
								// Horizontal win.
								if (((emoji === E_A_COLL.get(index + 1)) && (E_A_COLL.get(index + 1) === E_A_COLL.get(index + 2)) && (E_A_COLL.get(index + 2) === E_A_COLL.get(index + 3))) ||
									// Vertical win.
									((emoji === E_A_COLL.get(index + 4)) && (E_A_COLL.get(index + 4) === E_A_COLL.get(index + 8)) && (E_A_COLL.get(index + 8) === E_A_COLL.get(index + 12))) ||
									// Sliding diagonal win.
									((emoji === E_A_COLL.get(index + 5)) && (E_A_COLL.get(index + 5) === E_A_COLL.get(index + 10)) && (E_A_COLL.get(index + 10) === E_A_COLL.get(index + 15))) ||
									// Upwards diagonal win.
									((emoji === E_A_COLL.get(index + 3)) && (E_A_COLL.get(index + 3) === E_A_COLL.get(index + 6)) && (E_A_COLL.get(index + 6) === E_A_COLL.get(index + 9)))) {

									session.winner = (turn[1] === "❌") ? target : author;
									session.endGame();
								} else if (E_A.every((value) => ["❌", "⭕"].includes(value))) {
									// Tie.
									session.endGame();
								}
							}
						});
					} else {
						awaiting = true;
						reactions.next.then((reaction) => {
							awaiting = false;
							// do stuff here to blow stuff up cj.
						});
					}
				}
				reaction.remove(reaction.users.last());
			});
		}).catch(() => { session.endGame(); });
	},
	input: (input, session) => {
		return input.type === "reaction" && input.value.message.id === session.bigTictactoe.id;
	},
	end: (session) => {
		const result = (session.winner == null) ?
			"No one won. It was a draw." :
			`${session.winner} won the game!`;
		session.bigTictactoe.edit(`Interactive command ended: ${result}\n${session.bigTictactoe.content}`);
		session.bigTictactoe.channel.send(result);
		session.collector.stop("game ended");
	},
};
