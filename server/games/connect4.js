const { RichEmbed } = require("discord.js");
const EMOJI_ARRAY = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣"];

function getRow(rows, num) {
	for (var numberLoop = 1; numberLoop !== rows.length; numberLoop++)
		if (rows[numberLoop][num] !== "⚫")
			return numberLoop;
}

function split2Dim(arr) {
	return arr.map((val, index) => { return [index, val]; });
}

module.exports = {
	id: "connect4",
	shortDescription: "Play connect 4.",
	longDescription: "Play connect 4, a classic game with a 7x6 board where the goal is to get 4 coins in a row.",
	instructions: "React with the emoji corresponding to the row you wish to place a coin in.",
	betting: true,
	minPlayers: 2,
	maxPlayers: 2,
	requiresInvite: true,
	allowLateJoin: false,
	exec: (session) => {
		var author = session.host, target = session.players.last();
		session.players.set(author.id, author);
		var rows = [EMOJI_ARRAY, ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
				["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"]],
			connectFourEmbed = new RichEmbed().setColor(0x00AE86).setTitle("Connect Four").setFooter(`${author.tag}'s turn.`);
		connectFourEmbed.setDescription(`🔴 = ${author.tag}\n🔵 = ${target.tag}\n\n` + rows.map((row) => row.join(" ")).join("\n"));
		session.context.channel.send({ embed: connectFourEmbed }).then(async (connectFour) => {
			await connectFour.reactMultiple(EMOJI_ARRAY);
			var turn = author.id;
			var filter = (reaction, user) => (user.id === author.id || user.id === target.id) && EMOJI_ARRAY.includes(reaction.emoji.name)
				&& user.id !== session.context.client.user.id,
				collector = connectFour.createReactionCollector(filter, { time: 600000 });
			session.connectFour = connectFour;
			session.collector = collector;
			session.embed = connectFourEmbed;
			collector.on("collect", (reaction) => {
				reaction.remove(reaction.users.last());
				if (reaction.users.last().id === turn) {
					var currentRow = (getRow(rows, EMOJI_ARRAY.indexOf(reaction.emoji.name)) == null) ? 6 : getRow(rows, EMOJI_ARRAY.indexOf(reaction.emoji.name)) - 1;
					if (currentRow !== 0) {
						rows[currentRow][EMOJI_ARRAY.indexOf(reaction.emoji.name)] = (turn === author.id) ? "🔴" : "🔵";
						turn = (turn === author.id) ? target.id : author.id;
						connectFourEmbed.setFooter(`${(turn !== author.id) ? target.tag : author.tag}'s turn.`);
						session.embed = connectFourEmbed.setDescription(`🔴 = ${author.tag}\n🔵 = ${target.tag}\n\n` + rows.map((row) => row.join(" ")).join("\n"));
						connectFour.edit({ embed: connectFourEmbed })
							.then((newConnectFour) => session.connectFour = newConnectFour);
						for (var [indexOfRow, row] of split2Dim(rows)) {
							for (var [indexOfCoin, coin] of split2Dim(row)) {
								var done = false;
								if (coin !== "⚫" && coin === row[indexOfCoin + 1] &&
									row[indexOfCoin + 1] === row[indexOfCoin + 2] &&
									row[indexOfCoin + 2] === row[indexOfCoin + 3]) {
									done = true;
								}
								if (rows[indexOfRow + 1] != null && rows[indexOfRow + 2] != null && rows[indexOfRow + 3] != null) {
									if (coin !== "⚫" && coin === rows[indexOfRow + 1][indexOfCoin] &&
										rows[indexOfRow + 1][indexOfCoin] === rows[indexOfRow + 2][indexOfCoin] &&
										rows[indexOfRow + 2][indexOfCoin] === rows[indexOfRow + 3][indexOfCoin]) {
										done = true;
									}
								}
								if (rows[indexOfRow - 1] != null && rows[indexOfRow - 2] != null && rows[indexOfRow - 3] != null) {
									if (coin !== "⚫" && coin === rows[indexOfRow - 1][indexOfCoin + 1] &&
										rows[indexOfRow - 1][indexOfCoin + 1] === rows[indexOfRow - 2][indexOfCoin + 2] &&
										rows[indexOfRow - 2][indexOfCoin + 2] === rows[indexOfRow - 3][indexOfCoin + 3]) {
										done = true;
									}
								}
								if (rows[indexOfRow + 1] != null && rows[indexOfRow + 2] != null && rows[indexOfRow + 3] != null) {
									if (coin !== "⚫" && coin === rows[indexOfRow + 1][indexOfCoin + 1] &&
										rows[indexOfRow + 1][indexOfCoin + 1] === rows[indexOfRow + 2][indexOfCoin + 2] &&
										rows[indexOfRow + 2][indexOfCoin + 2] === rows[indexOfRow + 3][indexOfCoin + 3]) {
										done = true;
									}
								}
								if (done) {
									session.winner = (coin === "🔴") ? author : target;
									session.endGame();
								}
							}
						}

						if (rows.slice(1).every((row) => row.every((coin) => coin !== "⚫")))
							session.endGame();
					}
				}
			});
		});
	},
	input: (input, session) => {
		return input.type === "reaction" && input.value.message === session.connectFour;
	},
	end: (session) => {
		const result = (session.winner == null) ?
			"No one won. It was a draw." :
			`${session.winner} won the game!`;
		session.connectFour.edit("Interactive command ended: " + result, { embed: session.embed.setFooter((session.winner || { tag: "No one"}).tag + " won the game.") });
		session.connectFour.channel.send(result);
		session.collector.stop("game ended");
	}
};
