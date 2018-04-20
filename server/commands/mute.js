const ms = require("ms");

module.exports = {
	id: "ban",
	load: () => {},
	execute: (call) => {
		const rawContent = args.join(" ");
		const parameterOne = rawContent.split(" ")[0];
		const parameterTwo = rawContent.split(" ")[1];
		const modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		if (message.member.roles.some(role => modRoles.includes(role.id)) || message.member.hasPermission("KICK_MEMBERS")) {
			const target = message.guild.members
				.find(member => parameterOne.includes(member.user.id) || member.user.tag.toLowerCase().startsWith(parameterOne.toLowerCase()));
			if (target !== null) {
				if (message.member.highestRole.position > target.highestRole.position) {
					if (parameterTwo !== undefined) var muteTime = ms(parameterTwo);
					if (muteTime) {
						if (muteTime >= 10000) {
							target.addRole(message.guild.roles.find("name", "Muted")).then(() => {
								message.channel.send(`***Successfully muted \`${target.user.tag}\` for ${ms(muteTime, { long: true })}.***`).catch(function() {});
								bot.channels.get("436714650835484707").send(`${target.user.id} ${Date.now() + muteTime}`).then(msg => {
									setTimeout(() => {
										target.removeRole(message.guild.roles.find("name", "Muted")).catch(function() {});
										msg.delete().catch(function() {});
									}, muteTime);
								});
							}).catch(() => {
								message.channel.send(`Failed to mute \`${target.user.tag}\`.`).catch(function() {});
							});
						} else {
							message.reply("The time to mute the user must be at least 10 seconds.").catch(function() {});
						}
					} else {
						target.addRole(message.guild.roles.find("name", "Muted")).then(() => {
							message.channel.send(`***Successfully muted \`${target.user.tag}\`.***`).catch(function() {});
						}).catch(() => {
							message.channel.send(`Failed to mute \`${target.user.tag}\`.`).catch(function() {});
						});
					}
				} else {
					message.reply("That user is too far up in this guild's hierarchy to be muted by you.").catch(() => {
						message.author.send(`You attempted to use the \`mute\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				message.reply("Please specify a valid user.").catch(() => {
					message.author.send(`You attempted to use the \`mute\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			message.reply("You do not have permissions to trigger this command.").catch(() => {
				message.author.send(`You attempted to use the \`mute\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
