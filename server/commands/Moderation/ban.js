const Moderator = require("@utility/moderator");
const { GuildMember } = require("discord.js");

module.exports = {
	id: "ban",
	description: "Bans specified user.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	botRequires: ["BAN_MEMBERS"],
	botRequiresMessage: "To ban members.",
	access: "Server",
	exec: async (call) => {
<<<<<<< HEAD
		var param = call.params.readParam() || "";
=======
		const rawContent = call.params.readRaw(),
			parameterOne = (call.params.readParam() || ""),
			parameterTwo = (call.params.readParam() || "");
>>>>>>> 1b1d5d06071a35256de9626bbf4e936614e35f11
		if (Moderator(call.message.member)) {
			var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			var target = guild.members.find((m) => param.includes(`${m.user.id}`)) || param;
			if (!(target instanceof GuildMember) && target != null) {
				try {
					await call.client.fetchUser(target);
				} catch (exc) {
					console.warn(exc.stack);
				}
			}
			if (target != null) {
				if (call.message.member.highestRole.position > (target.highestRole || { position: 0 }).position) {
					var reason = call.params.readParam(true) || "No reason specified.";
					if (target.bannable || target.bannable === undefined) {
						try {
							if (target instanceof GuildMember)
								await target.send(`You have been banned from the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`);
						} catch (err) {
							console.warn(err.stack);
						}

						call.message.guild.ban(target, { days: 7, reason: `Banned by ${call.message.author.tag} for ${reason}` }).then((user) => {
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
