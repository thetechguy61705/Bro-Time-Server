const Moderator = require("@utility/moderator");
const { GuildMember } = require("discord.js");

module.exports = {
	id: "ban",
	aliases: ["hackerban"],
	description: "Bans specified user.",
	paramsHelp: "(user) [days to delete messages] [reason]",
	requires: "Moderator permissions",
	botRequires: ["BAN_MEMBERS"],
	botRequiresMessage: "To ban members.",
	access: "Server",
	exec: async (call) => {
		var param = call.params.readParam() || "";
		if (Moderator(call.message.member)) {
			var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			var target = guild.members.find((m) => param.includes(`${m.user.id}`)) || param;
			if (!(target instanceof GuildMember) && target != null) {
				try {
					target = await call.client.fetchUser(target);
				} catch (exc) {
					if (!exc.message.includes("not snowflake") && !exc.message.includes("Not Found")) console.warn(exc.stack);
					target = null;
				}
			}
			if (target != null) {
				if (call.message.member.highestRole.position > (target.highestRole || { position: 0 }).position) {
					var daysToDelete = call.params.readNumber(false);
					if (daysToDelete != null) {
						call.params.offset(daysToDelete.toString().length + 1);
						daysToDelete = daysToDelete < 0 ? 0 : daysToDelete > 7 ? 7 : daysToDelete;
					} else daysToDelete = 7;
					var reason = call.params.readParam(true) || "No reason specified.";
					if (target.bannable || target.bannable === undefined) {
						try {
							if (target instanceof GuildMember)
								await target.send(`You have been banned from the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch (err) {
							console.warn(err.stack);
						}

						call.message.guild.ban(target, { days: daysToDelete, reason: `Banned by ${call.message.author.tag} for ${reason}` }).then((user) => {
							call.message.channel.send(`***Successfully banned \`${user.tag}\`.***`);
						}).catch(() => {
							call.message.channel.send(`Failed to ban \`${target instanceof GuildMember ? target.user.tag : target}\`.`);
						});
					} else call.safeSend("I do not have permission to ban this user.");
				} else call.safeSend("That user is too far up in this guild's hierarchy to be banned by you.");
			} else call.safeSend("Please mention or supply the id of a valid user.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
