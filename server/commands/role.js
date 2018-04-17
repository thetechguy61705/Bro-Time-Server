module.exports = {
	id: "role",
	load: () => {},
	execute: (call) => {
		var roles = args.slice(1).join(" ").split(", ").filter(r => r !== "");
		const paramaterOne = args[0];
		const paramaterTwo = args[1];
		const paramaterThree = args[2];
		var target = message.guild.members
			.find(member => paramaterOne.includes(member.user.id) || member.user.tag.toLowerCase().startsWith(paramaterOne.toLowerCase()));
		var roleTarget;
		if (message.member.roles.some(role => ["330919872630358026", "402175094312665098", "395265037356236810", "387768886096953355"].includes(role.id))) {
			if (target !== null) {
				var rolesToChange = roles.map(roleToMap => message.guild.roles.find(r => r.name.toLowerCase().startsWith(roleToMap.toLowerCase())));
				var rolesToRemove = rolesToChange.filter(role => role !== null).filter(role => target.roles.find("name", role.name))
					.filter(role => message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position);
				var rolesToAdd = rolesToChange.filter(role => role !== null).filter(role => !target.roles.find("name", role.name))
					.filter(role => message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position);
				var messageToSend = "";
				if (rolesToAdd.length !== 0) {
					target.addRoles(rolesToAdd).catch(function() {});
					messageToSend = messageToSend + `\nRole(s) added to \`${target.user.tag}\`: \`${rolesToAdd.map(rM => rM.name).join("`, `")}\``
				}
				if (rolesToRemove.length !== 0) {
					target.removeRoles(rolesToRemove).catch(function() {});
					messageToSend = messageToSend + `\nRole(s) removed from \`${target.user.tag}\`: \`${rolesToRemove.map(rM => rM.name).join("`, `")}\``
				}
				if (messageToSend !== "") {
					message.channel.send(messageToSend).catch(function() {});
				} else {
					message.reply("You did not specify any valid roles, or you did not specify a role below your (or my) hierarchy.").catch(() => {
						message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				if (paramaterOne === "removeall") {
					target = message.guild.members.find(member => paramaterTwo.includes(member.user.id) || member.user.tag.startsWith(paramaterTwo));
					if (target !== null) {
						var removeAllRoles = target.roles
							.filter(role => message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position)
							.filter(role => role.name !== "@everyone");
						target.removeRoles(removeAllRoles).then(() => {
							message.channel.send(`Role(s) removed from \`${target.user.tag}\`: \`${removeAllRoles.map(rM => rM.name).join("`, `")}\``)
								.catch(function() {});
						}).catch(() => {
							message.reply("There was an error removing roles from that user.").catch(() => {
								message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						});
					} else {
						message.reply("Please specify a valid user.").catch(() => {
							message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				} else if (paramaterOne === "in") {
					roles = args.slice(1).join(" ").split(", ").slice(0, 2).filter(r => r !== "");
					if (roles.length === 2) {
						roleTarget = message.guild.roles.find(role => role.name.toLowerCase().startsWith(roles[0].toLowerCase()));
						var roleToChangeFromTarget = message.guild.roles.find(role => {
							if (roles[1].startsWith("-")) {
								return role.name.toLowerCase().startsWith(roles[1].substr(1).toLowerCase()) &&
									message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
							} else {
								return role.name.toLowerCase().startsWith(roles[1].toLowerCase()) &&
									message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
							}
						});
						if (roleTarget !== null) {
							if (roleToChangeFromTarget !== null) {
								roleTarget.members.forEach(member => {
									if (roles[1].startsWith("-")) {
										if (member.roles.has(roleToChangeFromTarget.id)) {
											member.removeRole(roleToChangeFromTarget).catch(function() {});
										}
									} else {
										if (!member.roles.has(roleToChangeFromTarget.id)) {
											member.addRole(roleToChangeFromTarget).catch(function() {});
										}
									}
								});
							} else {
								message.reply("Please specify a valid role to give below your (or my) hierarchy. Example: `!role in Nerds, Dumb`.").catch(() => {
									message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
								});
							}
						} else {
							message.reply("Please specify a valid role target. Example: `!role in Nerds, Dumb`.").catch(() => {
								message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					} else {
						message.reply(`Expected 2 parameters seperated by \`, \`. Got \`${roles.length}\`. Example: \`!role in Nerds, Dumb\`.`).catch(() => {
							message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				} else if (paramaterOne === "all") {
					roleTarget = message.guild.roles.find(role => {
						if (paramaterTwo.startsWith("-")) {
							return role.name.toLowerCase().startsWith(paramaterTwo.substr(1).toLowerCase()) &&
								message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
						} else {
							return role.name.toLowerCase().startsWith(paramaterTwo.toLowerCase()) &&
								message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
						}
					});
					if (roleTarget !== null) {
						var usersToRole;
						if (paramaterTwo.startsWith("-")) {
							usersToRole = message.guild.members.filter(m => m.roles.has(roleTarget.id)).size;
						} else {
							usersToRole = message.guild.members.filter(m => !m.roles.has(roleTarget.id)).size;
						}
						if (usersToRole !== 0) {
							var timeEstimate = "";
							if (usersToRole > 100) timeEstimate = "This may take some time.";
							message.channel.send(`Changing roles for \`${usersToRole}\` members. ${timeEstimate}`).catch(function() {});
							message.guild.members.forEach(member => {
								if (paramaterTwo.startsWith("-")) {
									if (member.roles.has(roleTarget.id)) {
										member.removeRole(roleTarget).catch(function() {});
									}
								} else {
									if (!member.roles.has(roleTarget.id)) {
										member.addRole(roleTarget0).catch(function() {});
									}
								}
							});
						} else {
							message.reply("Everyone is either already in this role, or everyone is not in this role.").catch(() => {
								message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					}
				} else if (paramaterOne === "humans") {
					roleTarget = message.guild.roles.find(role => {
						if (paramaterTwo.startsWith("-")) {
							return role.name.toLowerCase().startsWith(paramaterTwo.substr(1).toLowerCase()) &&
								message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
						} else {
							return role.name.toLowerCase().startsWith(paramaterTwo.toLowerCase()) &&
								message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
						}
					});
					if (roleTarget !== null) {
						var usersToRole;
						if (paramaterTwo.startsWith("-")) {
							usersToRole = message.guild.members.filter(m => !m.user.bot && m.roles.has(roleTarget.id)).size;
						} else {
							usersToRole = message.guild.members.filter(m => !m.user.bot && !m.roles.has(roleTarget.id)).size;
						}
						if (usersToRole !== 0) {
							var timeEstimate = "";
							if (usersToRole > 100) timeEstimate = "This may take some time.";
							message.channel.send(`Changing roles for \`${usersToRole}\` members. ${timeEstimate}`).catch(function() {});
							message.guild.members.filter(m => !m.user.bot).forEach(member => {
								if (paramaterTwo.startsWith("-")) {
									if (member.roles.has(roleTarget.id)) {
										member.removeRole(roleTarget).catch(function() {});
									}
								} else {
									if (!member.roles.has(roleTarget.id)) {
										member.addRole(roleTarget).catch(function() {});
									}
								}
							});
						} else {
							message.reply("Every human is either already in this role, or every human is not in this role.").catch(() => {
								message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					}
				} else if (paramaterOne === "bots") {
					roleTarget = message.guild.roles.find(role => {
						if (paramaterTwo.startsWith("-")) {
							return role.name.toLowerCase().startsWith(paramaterTwo.substr(1).toLowerCase()) &&
								message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
						} else {
							return role.name.toLowerCase().startsWith(paramaterTwo.toLowerCase()) &&
								message.member.highestRole.position > role.position && message.guild.me.highestRole.position > role.position;
						}
					});
					if (roleTarget !== null) {
						var usersToRole;
						if (paramaterTwo.startsWith("-")) {
							usersToRole = message.guild.members.filter(m => m.user.bot && m.roles.has(roleTarget.id)).size;
						} else {
							usersToRole = message.guild.members.filter(m => m.user.bot && !m.roles.has(roleTarget.id)).size;
						}
						if (usersToRole !== 0) {
							var timeEstimate = "";
							if (usersToRole > 100) timeEstimate = "This may take some time.";
							message.channel.send(`Changing roles for \`${usersToRole}\` members. ${timeEstimate}`).catch(function() {});
							message.guild.members.filter(m => m.user.bot).forEach(member => {
								if (paramaterTwo.startsWith("-")) {
									if (member.roles.has(roleTarget.id)) {
										member.removeRole(roleTarget).catch(function() {});
									}
								} else {
									if (!member.roles.has(roleTarget.id)) {
										member.addRole(roleTarget).catch(function() {});
									}
								}
							});
						} else {
							message.reply("Every bot is either already in this role, or every bot is not in this role.").catch(() => {
								message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					}
				} else {
					message.reply("Please specify a valid user.").catch(() => {
						message.author.send(`You attempted to use the \`role\` command in ${message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			}
		}
	}
};
