module.exports = {
	id: "tictactoe",
	shortDescription: "Play tictactoe.",
	longDescription: "Play tictactoe, where the goal is to get 3 of your X / O in a row.",
	instructions: "React with the emoji corresponding to the grid square you wish to put your X / O in.",
	minPlayers: 2,
	maxPlayers: 2,
	requiresInvite: true,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		const E_A = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
		const author = session.host;
		const target = session.players.last();
		var turn = [author, "❌"];
		session.context.
			channel.send(`${E_A[0]} | ${E_A[1]} | ${E_A[2]}\n———————\n${E_A[3]} | ${E_A[4]} | ${E_A[5]}\n———————\n${E_A[6]} | ${E_A[7]} | ${E_A[8]}\n\n${turn[0]}'s turn.`).then(async (msg) => {
				session.tictactoe = msg;
				await msg.reactMultiple(E_A);
				const filter = (reaction, user) => (user.id === author.id || user.id === target.id) && E_A.includes(reaction.emoji.name);
				const reactions = msg.createReactionCollector(filter, { time: 300000 });
				session.collector = reactions;
				reactions.on("collect", (reaction) => {
					if (reaction.users.last().id === turn[0].id) {
						for (let emoji of E_A) {
							if (emoji === reaction.emoji.name) {
								E_A.splice(E_A.indexOf(emoji), 1, turn[1]);
							}
						}

						turn = (turn[0].id === target.id) ? [author, "❌"] : [target, "⭕"];

						msg.edit(`${E_A[0]} | ${E_A[1]} | ${E_A[2]}\n———————\n${E_A[3]} | ${E_A[4]} | ${E_A[5]}\n———————\n${E_A[6]} | ${E_A[7]} | ${E_A[8]}\n\n${turn[0]}'s turn.`)
							.then((newMessage) => {
								session.tictactoe = newMessage;
								if ((E_A[0] === E_A[1] && E_A[1] === E_A[2]) || (E_A[3] === E_A[4] && E_A[4] === E_A[5]) || (E_A[6] === E_A[7] && E_A[7] === E_A[8]) ||
									(E_A[0] === E_A[3] && E_A[3] === E_A[6]) || (E_A[1] === E_A[4] && E_A[4] === E_A[7]) || (E_A[2] === E_A[5] && E_A[5] === E_A[8]) ||
									(E_A[0] === E_A[4] && E_A[4] === E_A[8]) || (E_A[2] === E_A[4] && E_A[4] === E_A[6])) {
									session.winner = (turn[1] === "❌") ? "⭕" : "❌";
									session.endGame();
								} else if (E_A.every((value) => value === "❌" || value === "⭕")) {
									session.endGame();
								}
							}).catch(() => {});
					}
					reaction.remove(reaction.users.last());
				});
			}).catch(() => { session.endGame(); });
	},
	input: (input, session) => {
		return input.type === "reaction" && input.value.message.id === session.tictactoe.id;
	},
	end: (session) => {
		const result = (session.winner == null) ?
			"No one won. It was a draw." :
			`${session.winner} won the game!`;
		session.tictactoe.edit(`Interactive command ended: ${result}\n${session.tictactoe.content}`);
		session.tictactoe.channel.send(result);
		session.collector.stop("game ended");
	},
};
