const ms = require("ms");
const Moderator = require("@utility/moderator");

module.exports = {
	id: "mute",
	description: "Gives the user the \"Muted\" role for the specified period of time. If no time is specified, it will not automatically remove the role.",
	paramsHelp: "(user) [time]",
	requires: "Moderator permissions",
	botRequires: ["MANAGE_ROLES"],
	access: "Server",
	exec: async (call) => {
		var parameterOne = call.params.readParam(),
			parameterTwo = call.params.readParam();
		if (Moderator(call.message.member)) {
			var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			var target = guild.members.find((member) => (parameterOne || "").includes(member.user.id) ||
				member.user.tag.toLowerCase().startsWith(parameterOne));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					if (!target.roles.has(guild.roles.find((role) => role.name === "Muted").id)) {
						var muteTime = (parameterTwo != null) ? ms(parameterTwo) : null;
						if (muteTime == null) call.params.offset(parameterTwo.length + 1);
						var reason = call.params.readParam(true) || "No reason specified.";
						if (muteTime != null) {
							if (muteTime >= 10000) {
								target.addRole(guild.roles.find((role) => role.name === "Muted")).then(() => {
									call.message.channel.send(`***Successfully muted \`${target.user.tag}\` for ${ms(muteTime, { long: true })}.***`);
									call.client.emit("mutedByCommand", {
										target: target,
										executor: call.message.member,
										time: muteTime,
										reason: reason
									});
									call.client.setTimeout(() => {
										target.removeRole(guild.roles.find((role) => role.name === "Muted"));
										call.client.emit("unmutedByCommand", {
											target: target,
											executor: call.message.guild.me,
											reason: "auto"
										});
									}, muteTime);
								}).catch(() => {
									call.message.channel.send(`Failed to mute \`${target.user.tag}\`.`);
								});
							} else call.message.reply("The time to mute the user must be at least 10 seconds.");
						} else {
							target.addRole(guild.roles.find("name", "Muted")).then(() => {
								call.message.channel.send(`***Successfully muted \`${target.user.tag}\`.***`);
								call.client.emit("mutedByCommand", {
									target: target,
									executor: call.message.member,
									time: Infinity,
									reason: reason
								});
							}).catch(() => {
								call.message.channel.send(`Failed to mute \`${target.user.tag}\`.`);
							});
						}
					} else call.safeSend("That user is already muted.");
				} else call.safeSend("That user is too far up in this guild's hierarchy to be muted by you.");
			} else call.safeSend("Please specify a valid user.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
