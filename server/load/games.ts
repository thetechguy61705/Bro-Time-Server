import games, { Input } from "@server/commands/Miscellaneous/games.ts";

module.exports = {
	id: "games",
	exec: (client) => {
		client.on("message", (message) => {
			games.dispatchInput(new Input("message", message.content, message.author, message.channel));
		});
		client.on("messageReactionAdd", (reaction, user) => {
			games.dispatchInput(new Input("reaction", reaction, user, reaction.message.channel));
		});
		client.on("guildMemberAdd", (member) => {
			games.dispatchInput(new Input("member", member, member.user));
		});
		client.on("walletChange", (user, amount) => {
			games.dispatchBalances(user, amount);
		});
	}
};
