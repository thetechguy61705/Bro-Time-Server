const Discord = require("discord.js");

function getRow(rows, num) {
	for (var numberLoop = 1; numberLoop !== rows.length; numberLoop++)
		if (rows[numberLoop][num] !== "⚫")
			return numberLoop;
}

module.exports = {
	id: "connect4",
	shortDescription: "Play connect 4.",
	longDescription: "Play connect 4, a classic game with a 7x6 board where the goal is to get 4 coins in a row.",
	instructions: "React with the emoji corresponding to the row you wish to place a coin in.",
	minPlayers: 2,
	maxPlayers: 2,
	requiresInvite: true,
	allowLateJoin: false,
	load: () => {},
	start: (session) => {
		const eA = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣"];
		var rows = [eA, ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"],
			["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"], ["⚫", "⚫", "⚫", "⚫", "⚫", "⚫", "⚫"]];
		const author = session.host;
		const target = session.players.last();
		var connectFourEmbed = new Discord.RichEmbed().setColor(0x00AE86).setTitle("Connect Four").setFooter(`${author.tag}'s turn.`);
		connectFourEmbed.setDescription(`🔴 = ${author.tag}\n🔵 = ${target.tag}\n\n` + rows.map(row => row.join(" ")).join("\n"));
		session.context.channel.send({ embed: connectFourEmbed }).then(async function(connectFour) {
			var orderLoop = 0;
			while (orderLoop != eA.length) {
				await connectFour.react(eA[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			var turn = author.id;
			const filter = (reaction, user) => (user.id === author.id || user.id === target.id) && eA.includes(reaction.emoji.name)
				&& user.id !== session.context.client.user.id;
			const collector = connectFour.createReactionCollector(filter, { time: 600000 });
			session.connectFour = connectFour;
			session.collector = collector;
			collector.on("collect", reaction => {
				reaction.remove(author.id).catch(function() {});
				reaction.remove(target.id).catch(function() {});
				if (reaction.users.last().id === turn) {
					var currentRow = getRow(rows, eA.indexOf(reaction.emoji.name));
					if (currentRow == null) currentRow = 6;
					else currentRow = currentRow - 1;
					if (currentRow !== 0) {
						if (turn === author.id) {
							rows[currentRow][eA.indexOf(reaction.emoji.name)] = "🔴";
							turn = target.id;
							connectFourEmbed.setFooter(`${target.tag}'s turn.`);
						} else {
							rows[currentRow][eA.indexOf(reaction.emoji.name)] = "🔵";
							turn = author.id;
							connectFourEmbed.setFooter(`${author.tag}'s turn.`);
						}
						connectFour
							.edit({ embed: connectFourEmbed.setDescription(`🔴 = ${author.tag}\n🔵 = ${target.tag}\n\n` + rows.map(row => row.join(" ")).join("\n")) })
							.then(newConnectFour => session.connectFour = newConnectFour);
						rows.forEach(function(row, indexOfRow) {
							row.forEach(function(coin, indexOfCoin) {
								if (coin !== "⚫" && coin === row[indexOfCoin + 1] &&
									row[indexOfCoin + 1] === row[indexOfCoin + 2] &&
									row[indexOfCoin + 2] === row[indexOfCoin + 3]) {
									session.winner = coin;
									session.endGame();
								}
								if (rows[indexOfRow + 1] !== undefined && rows[indexOfRow + 2] !== undefined && rows[indexOfRow + 3] !== undefined) {
									if (coin !== "⚫" && coin === rows[indexOfRow + 1][indexOfCoin] &&
										rows[indexOfRow + 1][indexOfCoin] === rows[indexOfRow + 2][indexOfCoin] &&
										rows[indexOfRow + 2][indexOfCoin] === rows[indexOfRow + 3][indexOfCoin]) {
										session.winner = coin;
										session.endGame();
									}
								}
								if (rows[indexOfRow - 1] !== undefined && rows[indexOfRow - 2] !== undefined && rows[indexOfRow - 3] !== undefined) {
									if (coin !== "⚫" && coin === rows[indexOfRow - 1][indexOfCoin + 1] &&
										rows[indexOfRow - 1][indexOfCoin + 1] === rows[indexOfRow - 2][indexOfCoin + 2] &&
										rows[indexOfRow - 2][indexOfCoin + 2] === rows[indexOfRow - 3][indexOfCoin + 3]) {
										session.winner = coin;
										session.endGame();
									}
								}
								if (rows[indexOfRow + 1] !== undefined && rows[indexOfRow + 2] !== undefined && rows[indexOfRow + 3] !== undefined) {
									if (coin !== "⚫" && coin === rows[indexOfRow + 1][indexOfCoin + 1] &&
										rows[indexOfRow + 1][indexOfCoin + 1] === rows[indexOfRow + 2][indexOfCoin + 2] &&
										rows[indexOfRow + 2][indexOfCoin + 2] === rows[indexOfRow + 3][indexOfCoin + 3]) {
										session.winner = coin;
										session.endGame();
									}
								}
							});
						});

						if (rows.slice(1).map(row => row.every(coin => coin !== "⚫")).every(row => row === true))
							session.endGame();
					}
				}
			});
		}).catch(function() {});
	},
	input: (input, session) => {
		return input.type === "reaction" && input.value.message === session.connectFour;
	},
	end: (session) => {
		const result = (session.winner == null) ?
			"No one won. It was a draw." :
			`${session.winner} won the game!`;
		session.connectFour.edit("Interactive command ended: " + result);
		session.collector.stop("game ended");
	}
};
