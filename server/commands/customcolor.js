var caproles = ["Red", "Blue", "Orange", "Green", "Black", "Purple", "Pink", "Yellow",
	"HotPink", "Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
	"DarkViolet", "Gold", "Multicolored"];
var allroles = ["red", "blue", "orange", "green", "black", "purple", "pink", "yellow",
	"hotpink", "indigo", "bronze", "cyan", "lightgreen", "silver", "brightred", "hotbrown",
	"darkviolet", "gold", "multicolored"];
var premiumcolors = ["pink", "indigo", "bronze", "hotpink", "cyan", "lightgreen", "silver", "brightred",
	"darkviolet", "hotbrown", "darkgreen", "gold", "multicolored"];
var freecolors = ["red", "blue", "orange", "green", "black", "purple", "yellow", "white"];

function removeColorRoles(roles, user) {
	caproles.forEach((color) => {
		if (user.roles.find("name", color)) {
			user.removeRole(roles.find("name", color)).catch(function(){});
		}
	});
}

module.exports = {
	id: "namecolor",
	load: () => {},
	execute: (call) => {
		let color = call.params.readRaw().toLowerCase();
		let role = call.params.readRole();
		if (allroles.includes(color)) {
			if (call.message.member.roles.find("name", "Bro Time Deluxe")) {
				removeColorRoles(call.message.guild.roles, call.message.member);
				call.message.member.addRole(role).then(() => {
					call.message.channel.send(`Successfully given you the \`${role.name}\` color role!`).catch(() => {
						call.message.author.send(`Successfully given you the \`${role.name}\` color role, note that I can not chat in ${call.message.channel}.`)
							.catch(function(){});
					});
				}).catch(() => {
					call.message.channel.send("There was an error while giving you the color role. Please try again.").catch(() => {
						call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
							.catch(function(){});
					});
				});
			} else if (call.message.member.roles.find("name", "Bro Time Premium")) {
				if (premiumcolors.includes(color) || freecolors.includes(color)) {
					removeColorRoles(call.message.guild.roles, call.message.member);
					call.message.member.addRole(role).then(() => {
						call.message.channel.send(`Successfully given you the \`${role.name}\` color role!`).catch(() => {
							call.message.author.send(`Successfully given you the \`${role.name}\` color role, note that I can not chat in ${call.message.channel}.`)
								.catch(function(){});
						});
					}).catch(() => {
						call.message.channel.send("There was an error while giving you the color role. Please try again.").catch(() => {
							call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
								.catch(function(){});
						});
					});				
				} else if (premiumcolors.includes(color)) {
					call.message.channel.send(`\`${role.name}\` is a premium and up color. Your plan is plus.`).catch(() => {
						call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
							.catch(function(){});
					});
				} else {
					if (freecolors.includes(color)) {
						removeColorRoles(call.message.guild.roles, call.message.member);
						call.message.member.addRole(role).then(() => {
						call.message.channel.send(`Successfully given you the \`${role.name}\` color role!`).catch(() => {
							call.message.author.send(`Successfully given you the \`${role.name}\` color role, note that I can not chat in ${call.message.channel}.`)
								.catch(function(){});
						});
						}).catch(() => {
							call.message.channel.send("There was an error while giving you the color role. Please try again.").catch(() => {
							call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
								.catch(function(){});
						});
					});
					} else if (premiumcolors.includes(color)) {
						call.message.channel.send(`\`${role.name}\` is a premium and up color. Your plan is free.`).catch(() => {
						call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
							.catch(function(){});
						});
				
		} else {
			call.message.channel.send(`\`${color} \` is not a valid color role. Make sure it contains no spaces.`).catch(() => {
				call.message.author.send(`You attempted to use the \`namecolor\` command in ${call.message.channel}, but I can not chat there.`)
					.catch(function(){});
			})
		}
				}
			}
		}
	}
}

