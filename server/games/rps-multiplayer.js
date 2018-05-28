module.exports = {
	id: "rps-multiplayer",
	shortDescription: "Play rps against a player.",
	longDescription: "Play rock-paper-scissors with a player, where the objective is to crush the opponent's chosen item.",
	instructions: "State either rock, paper or scissors to fight the opponents choice.",
	minPlayers: 2,
	maxPlayers: 2,
	requiresInvite: true,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		const PLAYERS = session.players.set(session.host.id, session.host),
			CHOICES = ["rock", "paper", "scissors"],
			OPCHOICES = ["paper", "scissors", "rock"];
		var waiting = [],
			messageWaiting = [];
		PLAYERS.forEach(async (player) => {
			messageWaiting.push(player.send("Choose one of the following options: `rock`, `paper` or `scissors`."));
		});
		Promise.all(messageWaiting).then((messages) => {
			messages.forEach((msg) => {
				const FILTER = (m) => CHOICES.includes(m.content.toLowerCase());
				waiting.push(msg.channel.awaitMessages(FILTER, { maxMatches: 1, time: 60000, errors: ["time"] }));
			});
			Promise.all(waiting).then((results) => {
				session.rps = {
					winner: (CHOICES.indexOf(results[0].first().content.toLowerCase()) === OPCHOICES.indexOf(results[1].first().content.toLowerCase())) ?
						results[1].first().author.toString() + " won!" :
						(results[1].first().content.toLowerCase() === results[0].first().content.toLowerCase()) ? "It was a draw!" : results[0].first().author.toString() + " won!",
					firstChoice: results[0].first(),
					lastChoice: results[1].first()
				};
				session.endGame();
			}).catch(() => {
				session.context.channel.send("Someone did not respond within 60 seconds.").catch(() => {});
			});
		}).catch(() => {
			session.context.channel.send("I could not send a dm message to one or more of the participating players.").catch(() => {});
		});
	},
	input: () => {},
	end: (session) => {
		if (session.rps != null) {
			session.context.channel.send(`${session.rps.firstChoice.author} chose \`${session.rps.firstChoice.content.toUpperCase()}\`, ` +
				`${session.rps.lastChoice.author} chose \`${session.rps.lastChoice.content.toUpperCase()}\`. ${session.rps.winner}`).catch(() => {});
		}
	},
};
