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
		const author = session.host;
		const target = session.players.last();
		var turn = [author, "❌"];
		var eA = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣"];
		session.context.
			channel.send(`${eA[0]} | ${eA[1]} | ${eA[2]}\n———————\n${eA[3]} | ${eA[4]} | ${eA[5]}\n———————\n${eA[6]} | ${eA[7]} | ${eA[8]}\n\n${turn[0]}'s turn.`).then(async (msg) => {
				session.tictactoe = msg;
				await msg.reactMultiple(eA);
				const filter = (reaction, user) => (user.id === author.id || user.id === target.id) && eA.includes(reaction.emoji.name);
				const reactions = msg.createReactionCollector(filter, { time: 300000 });
				session.collector = reactions;
				reactions.on("collect", (reaction) => {
					if (reaction.users.last().id === turn[0].id) {
						eA.forEach((emoji) => {
							if (emoji === reaction.emoji.name) {
								eA.splice(eA.indexOf(emoji), 1, turn[1]);
							}
						});

						turn = (turn[0].id === target.id) ? [author, "❌"] : [target, "⭕"];

						msg.edit(`${eA[0]} | ${eA[1]} | ${eA[2]}\n———————\n${eA[3]} | ${eA[4]} | ${eA[5]}\n———————\n${eA[6]} | ${eA[7]} | ${eA[8]}\n\n${turn[0]}'s turn.`)
							.then((newMessage) => {
								session.tictactoe = newMessage;
								if ((eA[0] === eA[1] && eA[1] === eA[2]) || (eA[3] === eA[4] && eA[4] === eA[5]) || (eA[6] === eA[7] && eA[7] === eA[8]) ||
									(eA[0] === eA[3] && eA[3] === eA[6]) || (eA[1] === eA[4] && eA[4] === eA[7]) || (eA[2] === eA[5] && eA[5] === eA[8]) ||
									(eA[0] === eA[4] && eA[4] === eA[8]) || (eA[2] === eA[4] && eA[4] === eA[6])) {
									session.winner = (turn[1] === "❌") ? "⭕" : "❌";
									session.endGame();
								} else if (eA.every((value) => value === "❌" || value === "⭕")) {
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
