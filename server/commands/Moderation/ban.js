const { GuildMember } = require("discord.js");
const isModerator = require("@utility/moderator");
const checkPositions = require("@utility/compareObjects").default;

module.exports = {
	id: "ban",
	aliases: ["hackerban"],
	description: "Bans specified user.",
	paramsHelp: "(user) [days to delete messages] [reason]",
	requires: "Moderator permissions",
	params: [
		{
			type: async (input, call) => {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				// eslint-disable-next-line no-unreachable
				return guild.members.find((m) => input.includes(m.user.id)) || await call.client.fetchUser(input);
			},
			greedy: false,
			failure: "Please mention or supply the id of a valid user.",
			required: true
		},
		{
			type: "number",
			greedy: false,
			default: 7,
			required: false
		},
		{
			type: "any",
			greedy: true,
			default: "No reason specified.",
			required: false
		}
	],
	botRequires: ["BAN_MEMBERS"],
	botRequiresMessage: "To ban members.",
	access: "Server",
	exec: async (call) => {
		if (isModerator(call.message.member)) {
			var target = call.parameters[0];
			if (checkPositions(call.message.member, target)) {
				var daysToDelete = call.parameters[1];
				var reason = call.parameters[2];
				var targetIsGm = target instanceof GuildMember;
				if (call.message.guild.me.hasPermission("BAN_MEMBERS") && (target.bannable || target.bannable === undefined)) {
					var dmed = false;
					try {
						if (targetIsGm) {
							await target.send(`You have been banned from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
							dmed = true;
						}
					} catch (err) {
						console.warn(err.stack);
					}
					var options = { days: daysToDelete, reason: `Banned by ${call.message.author.tag} for ${reason}` };

					(target.ban || call.message.guild.ban).call(targetIsGm ? target : call.message.guild,
						(targetIsGm ? options : target), options).then((user) => {
						call.message.channel.send(`***Successfully banned \`${(user.user || { tag: false }).tag || user.tag || user}\`.***`);
						call.client.emit("bannedByCommand", {
							target,
							executor: call.message.member,
							reason,
							daysDeleted: daysToDelete,
							dmed
						});
					}).catch((exc) => {
						console.warn(exc.stack);
						call.message.channel.send(`Failed to ban \`${targetIsGm ? target.user.tag : target.tag}\`.`);
					});
				} else call.safeSend("I do not have permission to ban this user.");
			} else call.safeSend("That user is too far up in this guild's hierarchy to be banned by you.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
