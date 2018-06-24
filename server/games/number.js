function guessNumber(session, correctNumber, timesGuessed) {
	var filter = (m) => m.author.id === session.host.id && Number(m.content);
	session.context.channel.awaitMessages(filter, { maxMatches: 1, time: 60000, errors: ["time"] }).then((messageRecieved) => {
		var guess = Number(messageRecieved.first().content);
		if (guess === correctNumber) {
			session.won = true;
			session.reason = "You guessed my number. You won 20 Bro Bits!";
			session.endGame();
		} else {
			if (timesGuessed !== 5) {
				session.context.message.reply("The number you guessed was "
				+ ((guess < correctNumber) ? "less" : "greater") + ` than my number. Try again. Remaining guesses: \`${5 - timesGuessed}\``).then(() => {
					guessNumber(session, correctNumber, timesGuessed + 1);
				});
			} else {
				session.reason = `Out of guesses! The correct number was ${correctNumber}`;
				session.endGame();
			}
		}
	}).catch(() => {
		session.reason = "Game was cancelled because there was no response within 60 seconds.";
		session.endGame();
	});
}

module.exports = {
	id: "number",
	aliases: ["guess"],
	shortDescription: "Guess my number and win Bro Bits.",
	longDescription: "Guess my number between 1-500 within 5 guesses and 1 minute and win 20 Bro Bits.",
	instructions: "Type a number to guess.",
	minPlayers: 1,
	maxPlayers: 1,
	timeout: 60000,
	requiresInvite: false,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		var correctNumber = Math.ceil(Math.random() * 500) + 1;
		session.context.channel.send(`${session.host}, Guess a number between 1-500. You have 5 guesses and 1 minute.`).then(() => {
			guessNumber(session, correctNumber, 1);
		});
	},
	input: (input, session) => {
		return input.type === "message" && input.user.id === session.host.id && Number(input.value);
	},
	end: (session) => {
		if (session.won) session.getWallet(session.host.id).change(20);
		session.context.message.reply("Game ended: " + (session.reason || "time."));
	},
};
