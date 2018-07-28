const Moderator = require("@utility/moderator");

module.exports = {
	id: "kick",
	description: "Kicks specified user.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	botRequires: ["KICK_MEMBERS"],
	botRequiresMessage: "To kick members.",
	access: "Server",
	exec: async (call) => {
		var param = call.params.readParam() || "";
		if (Moderator(call.message.member)) {
			var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			var target = guild.members.find((m) => param.includes(`${m.user.id}`));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					var reason = call.params.readParam(true) || "No reason specified.";
					if (target.kickable) {
						var dmed = false;
						try {
							await target.send(`You have been kicked from the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
							dmed = true;
						} catch (err) {
							console.warn(err.stack);
						}

						target.kick(`Kicked by ${call.message.author.tag} for ${reason}`).then((user) => {
							call.message.channel.send(`***Successfully kicked \`${user.tag}\`.***`);
							call.client.emit("kickedByCommand", {
								target: target,
								executor: call.message.member,
								reason: reason,
								dmed: dmed
							});
						}).catch(() => {
							call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`);
						});
					} else call.safeSend("I do not have permission to kick this user.");
				} else call.safeSend("That user is too far up in this guild's hierarchy to be kicked by you.");
			} else call.safeSend("Please mention or supply the id of a valid user.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
