import games, { Input } from "@server/commands/Miscellaneous/games.ts";
import { Message, MessageReaction, User, GuildMember, Snowflake, Client } from "discord.js";

module.exports = {
	id: "games",
	exec: (client: Client) => {
		client.on("message", (message: Message) => {
			games.dispatchInput(new Input("message", message.content, message.author, message.channel));
		});
		client.on("messageReactionAdd", (reaction: MessageReaction, user: User) => {
			games.dispatchInput(new Input("reaction", reaction, user, reaction.message.channel));
		});
		client.on("guildMemberAdd", (member: GuildMember) => {
			games.dispatchInput(new Input("member", member, member.user));
		});
		client.on("walletChange", (user: Snowflake, amount: number) => {
			games.dispatchBalances(user, amount);
		});
	}
};
