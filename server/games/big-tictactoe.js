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
	exec: (session) => {
		session.context.channel.send("SOON™");
		session.endGame();
	},
	input: () => {
		return false;
	},
	end: () => {},
};
