const isModerator = require("@utility/moderator");

module.exports = {
	id: "unban",
	description: "Unbans specified user.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	botRequires: ["BAN_MEMBERS"],
	botRequiresMessage: "To unban members.",
	access: "Server",
	exec: async (call) => {
		if (isModerator(call.message.member)) {
			var user = call.params.readParam();
			if (user != null) {
				var bannedUsers = await call.message.guild.fetchBans();
				user = bannedUsers.find((u) => user.includes(u.id) || u.tag.toLowerCase().startsWith(user.toLowerCase()));
				if (user != null) {
					var reason = call.params.readParam(true) || "No reason specified.";
					call.message.guild.unban(user, `Unbanned by ${call.message.author.tag} for ${reason}`).then((unbannedUser) => {
						call.message.channel.send(`***Successfully unbanned \`${unbannedUser.tag}\`.***`);
						call.client.emit("unbannedByCommand", {
							target: user,
							executor: call.message.member,
							reason
						});
					}).catch(() => {
						call.message.reply(`Failed to unban \`${user.tag}\`.`);
					});
				} else call.safeSend("Could not find a banned user that matches the given query.");
			} else call.safeSend("Please specify a user to unban.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
