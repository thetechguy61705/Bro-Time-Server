module.exports = {
	id: "rps-single",
	shortDescription: "Play rps against Bro Bot.",
	longDescription: "Play rock-paper-scissors with Bro Bot, where the objective is to crush the opponent's chosen item.",
	instructions: "State either rock, paper or scissors to fight the opponents choice.",
	minPlayers: 1,
	maxPlayers: 1,
	requiresInvite: false,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		const CHOICES = ["rock", "paper", "scissors"],
			OPCHOICES = ["paper", "scissors", "rock"],
			FILTER = (m) => m.author.id === session.host.id && CHOICES.includes(m.content.toLowerCase());
		session.context.channel.send("Choose one of the following options: `rock`, `paper` or `scissors`.").then((rpsMessage) => {
			rpsMessage.channel.awaitMessages(FILTER, { maxMatches: 1, time: 60000 }).then(rps => {
				const BOT_CHOICE = CHOICES[Math.floor(Math.random() * CHOICES.length)];
				session.rps = {
					winner: (CHOICES.indexOf(BOT_CHOICE) === OPCHOICES.indexOf(rps.first().content.toLowerCase())) ?
						"You win!" :
						(BOT_CHOICE === rps.first().content.toLowerCase()) ? "It was a draw!" : "I win!",
					botChoice: BOT_CHOICE.toUpperCase(),
					playerChoice: rps.first().content.toUpperCase()
				};
				session.endGame();
			});
		});
	},
	input: () => {},
	end: (session) => {
		session.context.channel.send(`${session.host}, I chose \`${session.rps.botChoice}\`, you chose \`${session.rps.playerChoice}\`. ${session.rps.winner}`);
	},
};
