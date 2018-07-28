const Moderator = require("@utility/moderator");

module.exports = {
	id: "warn",
	description: "Sends the user a dm with the supplied reason.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	access: "Server",
	exec: async (call) => {
		var param = call.params.readParam() || "";
		if (Moderator(call.message.member)) {
			if (param != null) {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				var target = guild.members.find((member) => param.includes(member.user.id) || member.user.tag.toLowerCase().startsWith(param.toLowerCase()));
				if (target != null) {
					if (!target.user.bot) {
						if (target.highestRole.position < call.message.member.highestRole.position) {
							var reason = call.params.readParam(true) || "`No reason specified.`";
							var dmed = false;
							try {
								await target.send(`You have been warned in the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}.`);
								dmed = true;
							} catch (err) {
								console.warn(err.stack);
							}

							call.message.channel.send(`***Successfully warned \`${target.user.tag}\`.***`);
							call.client.emit("memberWarned", { target: target, executor: call.message.member, reason: reason, dmed: dmed });
						} else call.safeSend("Specified user is too high in this guild's hierarchy to be warned by you.");
					} else call.safeSend("You cannot warn a bot account.");
				} else call.safeSend("Please supply a valid user tag, mention, or id.");
			} else call.safeSend("Please supply a valid user tag, mention, or id.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
