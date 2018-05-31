const ms = require("ms");

module.exports = {
	id: "mute",
	description: "Gives the user the \"Muted\" role for the specified period of time. If no time is specified, it will not automatically remove the role.",
	arguments: "(user) [time]",
	requires: "Moderator permissions",
	execute: (call) => {
		const rawContent = call.params.readRaw();
		const parameterOne = rawContent.split(" ")[0];
		const parameterTwo = rawContent.split(" ")[1];
		const modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		if (call.message.member.roles.some((role) => modRoles.includes(role.id))) {
			const target = call.message.guild.members
				.find((member) => parameterOne.includes(member.user.id) || member.user.tag.toLowerCase().startsWith(parameterOne.toLowerCase()));
			if (target !== null) {
				if (call.message.member.highestRole.position > target.highestRole.position) {
					if (!target.roles.has(call.message.guild.roles.find("name", "Muted").id)) {
						var muteTime = (parameterTwo !== undefined) ? ms(parameterTwo) : null;
						if (muteTime) {
							if (muteTime >= 10000) {
								target.addRole(call.message.guild.roles.find("name", "Muted")).then(() => {
									call.message.channel.send(`***Successfully muted \`${target.user.tag}\` for ${ms(muteTime, { long: true })}.***`).catch(function() {});
									call.client.channels.get("436714650835484707").send(`${target.user.id} ${Date.now() + muteTime}`).then((msg) => {
										call.client.setTimeout(() => {
											target.removeRole(call.message.guild.roles.find("name", "Muted")).catch(function() {});
											msg.delete().catch(function() {});
										}, muteTime);
									}).catch(() => {});
								}).catch(() => {
									call.message.channel.send(`Failed to mute \`${target.user.tag}\`.`).catch(function() {});
								});
							} else call.message.reply("The time to mute the user must be at least 10 seconds.").catch(function() {});
						} else {
							target.addRole(call.message.guild.roles.find("name", "Muted")).then(() => {
								call.message.channel.send(`***Successfully muted \`${target.user.tag}\`.***`).catch(function() {});
							}).catch(() => {
								call.message.channel.send(`Failed to mute \`${target.user.tag}\`.`).catch(function() {});
							});
						}
					} else {
						call.message.reply("That user is already muted.").catch(() => {
							call.message.author.send(`You attempted to use the \`mute\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				} else {
					call.message.reply("That user is too far up in this guild's hierarchy to be muted by you.").catch(() => {
						call.message.author.send(`You attempted to use the \`mute\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				call.message.reply("Please specify a valid user.").catch(() => {
					call.message.author.send(`You attempted to use the \`mute\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`mute\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
