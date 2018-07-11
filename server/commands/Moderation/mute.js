const ms = require("ms");
const Moderator = require("app/moderator");

module.exports = {
	id: "mute",
	description: "Gives the user the \"Muted\" role for the specified period of time. If no time is specified, it will not automatically remove the role.",
	paramsHelp: "(user) [time]",
	requires: "Moderator permissions",
	botRequires: ["MANAGE_ROLES"],
	access: "Server",
	execute: (call) => {
		const parameterOne = call.params.readParam(), parameterTwo = call.params.readParam();
		if (Moderator(call.message.member)) {
			const target = call.message.guild.members.find((member) => (parameterOne || "").includes(member.user.id) ||
				member.user.tag.toLowerCase().startsWith(parameterOne));
			if (target != null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					if (!target.roles.has(call.message.guild.roles.find("name", "Muted").id)) {
						var muteTime = (parameterTwo != null) ? ms(parameterTwo) : null;
						if (muteTime != null) {
							if (muteTime >= 10000) {
								target.addRole(call.message.guild.roles.find("name", "Muted")).then(() => {
									call.message.channel.send(`***Successfully muted \`${target.user.tag}\` for ${ms(muteTime, { long: true })}.***`);
									call.client.channels.get("457235875487678465").send(`${target.user.id} ${Date.now() + muteTime}`).then((msg) => {
										call.client.setTimeout(() => {
											target.removeRole(call.message.guild.roles.find("name", "Muted"));
											msg.delete();
										}, muteTime);
									});
								}).catch(() => {
									call.message.channel.send(`Failed to mute \`${target.user.tag}\`.`);
								});
							} else call.message.reply("The time to mute the user must be at least 10 seconds.");
						} else {
							target.addRole(call.message.guild.roles.find("name", "Muted")).then(() => {
								call.message.channel.send(`***Successfully muted \`${target.user.tag}\`.***`);
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
