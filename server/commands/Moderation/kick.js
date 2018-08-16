const Moderator = require("@utility/moderator");

module.exports = {
	id: "kick",
	description: "Kicks specified user.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	params: [
		{
			type: async (input, call) => {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				return guild.members.find((m) => input.includes(m.user.id));
			},
			greedy: false,
			failure: "Please mention or supply the id of a valid user.",
			required: true
		},
		{
			type: "any",
			greedy: true,
			failure: () => {},
			default: "No reason specified.",
			required: false
		}
	],
	botRequires: ["KICK_MEMBERS"],
	botRequiresMessage: "To kick members.",
	access: "Server",
	exec: async (call) => {
		if (Moderator(call.message.member)) {
			var target = call.parameters[0];
			if (call.message.member.highestRole.position > target.highestRole.position) {
				var reason = call.parameters[1];
				if (target.kickable) {
					var dmed = false;
					try {
						await target.send(`You have been kicked from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						dmed = true;
					} catch (err) {
						console.warn(err.stack);
					}

					target.kick(`Kicked by ${call.message.author.tag} for ${reason}`).then((kicked) => {
						call.message.channel.send(`***Successfully kicked \`${kicked.user.tag}\`.***`);
						call.client.emit("kickedByCommand", { target, executor: call.message.member, reason, dmed });
					}).catch(() => {
						call.message.channel.send(`Failed to kick \`${target.user.tag}\`.`);
					});
				} else call.safeSend("I do not have permission to kick this user.");
			} else call.safeSend("That user is too far up in this guild's hierarchy to be kicked by you.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
