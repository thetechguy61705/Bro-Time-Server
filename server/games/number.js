function guessNumber(session, correctNumber, timesGuessed) {
	var filter = (m) => m.author.id === session.host.id && Number(m.content);
	session.context.channel.awaitMessages(filter, { maxMatches: 1, time: 30000, errors: ["time"] }).then((messageRecieved) => {
		let guess = Number(messageRecieved.first().content);
		if (guess === correctNumber) {
			session.endGame();
			return session.context.channel.send(`${session.host}, You guessed my number!`);
		} else {
			if (timesGuessed !== 5) {
				session.context.channel.send(`${session.host}, the number you guessed was `
				+ ((guess < correctNumber) ? "less" : "greater") + ` than my number. Try again. Remaining guesses: \`${5-timesGuessed}\``).then(() => {
					guessNumber(session, correctNumber, timesGuessed + 1);
				});
			} else {
				session.endGame();
				return session.context.channel.send(`${session.host}, Out of guesses! The correct number was ${correctNumber}`);
			}
		}
	}).catch(() => {
		session.endGame();
		return session.context.channel.send(`${session.host}, Game was cancelled because there was no response`);
	});
}
module.exports = {
	id: "number",
	shortDescription: "Guess my number and win Bro Bits.",
	longDescription: "Guess my number between 1-500 within 5 guesses and 1 minute and win 10 Bro Bits.",
	instructions: "Type a number to guess.",
	minPlayers: 1,
	maxPlayers: 1,
	requiresInvite: false,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		session.players.set(session.host.id, session.host);
		var correctNumber = Math.ceil(Math.random() * 500) + 1;
		session.context.client.setTimeout(() => {
			if (!session.ended) return session.context.channel.send(`${session.host}, Out of time! The correct number was ${correctNumber}`);
		}, 60000);
		session.context.channel.send(`${session.host}, Guess a number between 1-500. You have 5 guesses and 1 minute.`).then(() => {
			guessNumber(session, correctNumber, 1);
		});
	},
	input: () => {},
	end: () => {},
};
