module.exports = {
	id: "role",
	description: "Gives the user the specified role(s) if the role is below the author's highest role.",
	arguments: "(user/option) [role/roles]",
	requires: "Moderator permissions",
	execute: (call) => {
		let roles = call.params.readRaw().split(" ").slice(1).join(" ").split(", ").filter(r => r !== "");
		const paramaterOne = call.params.readRaw().split(" ")[0], paramaterTwo = call.params.readRaw().split(" ")[1],
			modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		let options = ["removeall", "all", "bots", "humans", "in"], timeEstimate = "", target = null, usersToRole,
			roleTarget, roleToChangeFromTarget;
		if (!options.includes(paramaterOne.toLowerCase())) target = call.message.guild.members.find(member => paramaterOne.includes(member.user.id) ||
		member.user.tag.toLowerCase().startsWith(paramaterOne.toLowerCase()));
		if (call.message.member.roles.some(role => modRoles.includes(role.id))) {
			if (target !== null) {
				let rolesToChange = roles.map(roleToMap => call.message.guild.roles.find(r => r.name.toLowerCase().startsWith(roleToMap.toLowerCase())));
				let rolesToRemove = rolesToChange.filter(role => role !== null).filter(role => target.roles.find("name", role.name))
					.filter(role => call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position);
				let rolesToAdd = rolesToChange.filter(role => role !== null).filter(role => !target.roles.find("name", role.name))
					.filter(role => call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position);
				let messageToSend = "";
				if (rolesToAdd.length !== 0) {
					rolesToAdd.forEach(roleToAdd => {
						target.addRole(roleToAdd).catch(function() {});
					});
					messageToSend = messageToSend + `\nRole(s) added to \`${target.user.tag}\`: \`${rolesToAdd.map(rM => rM.name).join("`, `")}\``;
				}
				if (rolesToRemove.length !== 0) {
					rolesToRemove.forEach(roleToRemove => {
						target.removeRole(roleToRemove);
					});
					messageToSend = messageToSend + `\nRole(s) removed from \`${target.user.tag}\`: \`${rolesToRemove.map(rM => rM.name).join("`, `")}\``;
				}
				if (messageToSend !== "") {
					call.message.channel.send(messageToSend).catch(function() {});
				} else {
					call.message.reply("You did not specify any valid roles, or you did not specify a role below your (or my) hierarchy.").catch(() => {
						call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			} else {
				if (paramaterOne === "removeall") {
					target = call.message.guild.members.find(member => paramaterTwo.includes(member.user.id) || member.user.tag.startsWith(paramaterTwo));
					if (target !== null) {
						let removeAllRoles = target.roles.filter(role => call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position)
							.filter(role => role.name !== "@everyone");
						target.removeRoles(removeAllRoles).then(() => {
							call.message.channel.send(`Role(s) removed from \`${target.user.tag}\`: \`${removeAllRoles.map(rM => rM.name).join("`, `")}\``)
								.catch(function() {});
						}).catch(() => {
							call.message.reply("There was an error removing roles from that user.").catch(() => {
								call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
							});
						});
					} else {
						call.message.reply("Please specify a valid user.").catch(() => {
							call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				} else if (paramaterOne === "in") {
					roles = call.params.readRaw().split(" ").slice(1).join(" ").split(", ").slice(0, 2).filter(r => r !== "");
					if (roles.length === 2) {
						roleTarget = call.message.guild.roles.find(role => role.name.toLowerCase().startsWith(roles[0].toLowerCase()));
						roleToChangeFromTarget = call.message.guild.roles.find(role => {
							if (roles[1].startsWith("-")) return role.name.toLowerCase().startsWith(roles[1].substr(1).toLowerCase()) &&
									call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
							else return role.name.toLowerCase().startsWith(roles[1].toLowerCase()) &&
							call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
						});
						if (roleTarget !== null) {
							if (roleToChangeFromTarget !== null) {
								call.message.channel.send(`Changing roles for people in the \`${roleTarget.name}\` role with the \`${roleToChangeFromTarget.name}\` role.`)
									.catch(function() {});
								roleTarget.members.forEach(member => {
									if (roles[1].startsWith("-")) {
										if (member.roles.has(roleToChangeFromTarget.id)) member.removeRole(roleToChangeFromTarget).catch(function() {});
									} else {
										if (!member.roles.has(roleToChangeFromTarget.id)) member.addRole(roleToChangeFromTarget).catch(function() {});
									}
								});
							} else {
								call.message.reply("Please specify a valid role to give below your (or my) hierarchy. Example: `!role in Nerds, Dumb`.").catch(() => {
									call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
								});
							}
						} else {
							call.message.reply("Please specify a valid role target. Example: `!role in Nerds, Dumb`.").catch(() => {
								call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					} else {
						call.message.reply(`Expected 2 parameters seperated by \`, \`. Got \`${roles.length}\`. Example: \`!role in Nerds, Dumb\`.`).catch(() => {
							call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				} else if (paramaterOne === "all") {
					roleTarget = call.message.guild.roles.find(role => {
						if (paramaterTwo.startsWith("-")) return role.name.toLowerCase().startsWith(paramaterTwo.substr(1).toLowerCase()) &&
								call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
						else return role.name.toLowerCase().startsWith(paramaterTwo.toLowerCase()) &&
								call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
					});
					if (roleTarget !== null) {
						usersToRole = (paramaterTwo.startsWith("-"))
							? call.message.guild.members.filter(m => m.roles.has(roleTarget.id)).size
							: call.message.guild.members.filter(m => !m.roles.has(roleTarget.id)).size;
						if (usersToRole !== 0) {
							if (usersToRole > 100) timeEstimate = "This may take some time.";
							call.message.channel.send(`Changing roles for \`${usersToRole}\` members. ${timeEstimate}`).catch(function() {});
							call.message.guild.members.forEach(member => {
								if (paramaterTwo.startsWith("-")) {
									if (member.roles.has(roleTarget.id)) member.removeRole(roleTarget).catch(function() {});
								} else {
									if (!member.roles.has(roleTarget.id)) member.addRole(roleTarget).catch(function() {});
								}
							});
						} else {
							call.message.reply("Everyone is either already in this role, or everyone is not in this role.").catch(() => {
								call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					}
				} else if (paramaterOne === "humans") {
					roleTarget = call.message.guild.roles.find(role => {
						if (paramaterTwo.startsWith("-")) return role.name.toLowerCase().startsWith(paramaterTwo.substr(1).toLowerCase()) &&
								call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
						else return role.name.toLowerCase().startsWith(paramaterTwo.toLowerCase()) &&
								call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
					});
					if (roleTarget !== null) {
						if (paramaterTwo.startsWith("-")) usersToRole = call.message.guild.members.filter(m => !m.user.bot && m.roles.has(roleTarget.id)).size;
						else usersToRole = call.message.guild.members.filter(m => !m.user.bot && !m.roles.has(roleTarget.id)).size;
						if (usersToRole !== 0) {
							if (usersToRole > 100) timeEstimate = "This may take some time.";
							call.message.channel.send(`Changing roles for \`${usersToRole}\` members. ${timeEstimate}`).catch(function() {});
							call.message.guild.members.filter(m => !m.user.bot).forEach(member => {
								if (paramaterTwo.startsWith("-")) {
									if (member.roles.has(roleTarget.id)) member.removeRole(roleTarget).catch(function() {});
								} else {
									if (!member.roles.has(roleTarget.id)) member.addRole(roleTarget).catch(function() {});
								}
							});
						} else {
							call.message.reply("Every human is either already in this role, or every human is not in this role.").catch(() => {
								call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					}
				} else if (paramaterOne === "bots") {
					roleTarget = call.message.guild.roles.find(role => {
						if (paramaterTwo.startsWith("-")) return role.name.toLowerCase().startsWith(paramaterTwo.substr(1).toLowerCase()) &&
								call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
						else return role.name.toLowerCase().startsWith(paramaterTwo.toLowerCase()) &&
								call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
					});
					if (roleTarget !== null) {
						if (paramaterTwo.startsWith("-")) usersToRole = call.message.guild.members.filter(m => m.user.bot && m.roles.has(roleTarget.id)).size;
						else usersToRole = call.message.guild.members.filter(m => m.user.bot && !m.roles.has(roleTarget.id)).size;
						if (usersToRole !== 0) {
							if (usersToRole > 100) timeEstimate = "This may take some time.";
							call.message.channel.send(`Changing roles for \`${usersToRole}\` members. ${timeEstimate}`).catch(function() {});
							call.message.guild.members.filter(m => m.user.bot).forEach(member => {
								if (paramaterTwo.startsWith("-")) {
									if (member.roles.has(roleTarget.id))	member.removeRole(roleTarget).catch(function() {});
								} else {
									if (!member.roles.has(roleTarget.id)) member.addRole(roleTarget).catch(function() {});
								}
							});
						} else {
							call.message.reply("Every bot is either already in this role, or every bot is not in this role.").catch(() => {
								call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					}
				} else if (paramaterOne === "not-in") {
					roles = call.params.readRaw().split(" ").slice(1).join(" ").split(", ").slice(0, 2).filter(r => r !== "");
					if (roles.length === 2) {
						roleTarget = call.message.guild.roles.find(role => role.name.toLowerCase().startsWith(roles[0].toLowerCase()));
						roleToChangeFromTarget = call.message.guild.roles.find(role => {
							if (roles[1].startsWith("-")) return role.name.toLowerCase().startsWith(roles[1].substr(1).toLowerCase()) &&
									call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
							else return role.name.toLowerCase().startsWith(roles[1].toLowerCase()) &&
									call.message.member.highestRole.position > role.position && call.message.guild.me.highestRole.position > role.position;
						});
						if (roleTarget !== null) {
							if (roleToChangeFromTarget !== null) {
								call.message.channel.send(`Changing roles for peoplen ot in the \`${roleTarget.name}\` role with the \`${roleToChangeFromTarget.name}\` role.`)
									.catch(function() {});
								call.message.guild.members.forEach(member => {
									if (roleTarget.members.find(m => member.user.id === m.user.id) === null) {
										if (roles[1].startsWith("-")) {
											if (member.roles.has(roleToChangeFromTarget.id)) member.removeRole(roleToChangeFromTarget).catch(function() {});
										} else {
											if (!member.roles.has(roleToChangeFromTarget.id)) member.addRole(roleToChangeFromTarget).catch(function() {});
										}
									}
								});
							} else {
								call.message.reply("Please specify a valid role to give below your (or my) hierarchy. Example: `!role in Nerds, Dumb`.").catch(() => {
									call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
								});
							}
						} else {
							call.message.reply("Please specify a valid role target. Example: `!role in Nerds, Dumb`.").catch(() => {
								call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
							});
						}
					} else {
						call.message.reply(`Expected 2 parameters seperated by \`, \`. Got \`${roles.length}\`. Example: \`!role in Nerds, Dumb\`.`).catch(() => {
							call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
						});
					}
				} else {
					call.message.reply("Please specify a valid user.").catch(() => {
						call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
					});
				}
			}
		} else {
			call.message.reply("You do not have permission to use this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
