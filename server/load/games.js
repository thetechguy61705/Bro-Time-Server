module.exports = {
	id: "games",
	exec: (client) => {
		var games = require("@server/commands/Miscellaneous/games");
		client.on("message", (message) => {
			games.dispatchInput(new games.Input("message", message.content, message.author, message.channel));
		});
		client.on("messageReactionAdd", (reaction, user) => {
			games.dispatchInput(new games.Input("reaction", reaction, user, reaction.message.channel));
		});
		client.on("guildMemberAdd", (member) => {
			games.dispatchInput(new games.Input("member", member, member.user));
		});
		client.on("walletChange", (user, amount) => {
			games.dispatchBalances(user, amount);
		});
	}
};
