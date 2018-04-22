const Discord = require("discord.js");
const fs = require("fs");

async function awaitReply(message, question, limit = 60000) {
	const filter = m => m.author.id === message.author.id;
	await message.reply(question);
	try {
		const collected = await message.channel.awaitMessages(filter, {
			max: 1,
			time: limit,
			errors: ["time"]
		});
		return collected.first().content;
	} catch (error) {
		return false;
	}
}

async function gameRoles(message, Discord, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var games = ["`Roblox`", "`Minecraft`", "`Cuphead`", "`Fortnite`", "`Undertale`", "`Unturned`", "`VRChat`",
		"`PUBG`", "`FNAF`", "`Clash of Clans`", "`Clash Royale`", "`Sims`", "`Terraria`", "`Subnautica`", "`Rocket League`",
		"`Portal`", "`Hat in Time`", "`CSGO`", "`Splatoon`", "`Mario`", "`Starbound`", "`Garry's Mod`", "`Overwatch`",
		"`Call of Duty`", "`Destiny`", "`Psych`"
	];
	if (prompt.toLowerCase() === "preview") {
		var gameRoleEmbed = new Discord.RichEmbed()
			.setTitle(games[0].substr(1).slice(0, -1))
			.setDescription(`Players: \`${message.guild.roles.find("name", games[0].substr(1).slice(0, -1)).members.size}\``)
			.setColor(message.guild.roles.find("name", games[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		message.channel.send(gameRoleEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === message.author.id;
			var reactions = embedMessage.createReactionCollector(filter, {
				time: 120000
			});
			var emojiNumber = 0;
			reactions.on("collect", async function(reaction) {
				if (reaction.emoji.name === emojiArray[0]) {
					if (emojiNumber !== 0) {
						emojiNumber = emojiNumber - 1;
					} else {
						emojiNumber = games.length - 1;
					}
				} else if (reaction.emoji.name === emojiArray[1]) {
					if (emojiNumber !== games.length - 1) {
						emojiNumber = emojiNumber + 1;
					} else {
						emojiNumber = 0;
					}
				}
				await reaction.remove(message.author);
				currentRole = message.guild.roles.find("name", games[emojiNumber].substr(1).slice(0, -1));
				var gameRoleEmbed = new Discord.RichEmbed()
					.setTitle(games[emojiNumber].substr(1).slice(0, -1))
					.setDescription(`Players: \`${currentRole.members.size}\``)
					.setColor(currentRole.hexColor);
				embedMessage.edit({
					embed: gameRoleEmbed
				});
			});
			reactions.on("end", () => embedMessage.edit("Interactive command ended: 2 minutes passed."));
		});
	} else if (prompt.toLowerCase() === "specify") {
		var prompt2 = await awaitReply(message, "What game role do you want info on?");
		prompt2 = games.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new Discord.RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Players: \`${currentRole.members.size}\``)
				.setColor(currentRole.hexColor);
			message.channel.send({
				embed: roleEmbed
			});
		} else {
			message.reply("Invalid game role. Check `!info gameroles --> list`.");
		}
	} else {
		var endMessage = games.join("\n");
		gameRoleEmbed = new Discord.RichEmbed()
			.setTitle("Gameroles")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		message.channel.send({
			embed: gameRoleEmbed
		});
	}
}

async function nameColors(message, Discord, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var endMessage = ["**Free**", "`Red`", "`Yellow`", "`Blue`", "`Orange`", "`Green`", "`Black`", "`Purple`",
		"**Plus**", "`Pink`", "`Indigo`", "`Bronze`", "`HotPink`", "`Cyan`", "`LightGreen`", "**Premium**",
		"`Silver`", "`BrightRed`", "`DarkViolet`", "`HotBrown`", "`DarkGreen`", "**Deluxe**", "`Gold`"
	];
	var colorRoles = ["`Red`", "`Yellow`", "`Blue`", "`Orange`", "`Green`", "`Black`", "`Purple`",
		"`Pink`", "`Indigo`", "`Bronze`", "`HotPink`", "`Cyan`", "`LightGreen`",
		"`Silver`", "`BrightRed`", "`DarkViolet`", "`HotBrown`", "`DarkGreen`", "`Gold`"
	];
	if (prompt.toLowerCase() === "preview") {
		currentRole = message.guild.roles.find("name", colorRoles[0].substr(1).slice(0, -1));
		var nameColorEmbed = new Discord.RichEmbed()
			.setTitle(colorRoles[0].substr(1).slice(0, -1))
			.setDescription(`Hex: \`${currentRole.hexColor}\`\nMembers: \`${currentRole.members.size}\``)
			.setColor(message.guild.roles.find("name", colorRoles[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		message.channel.send(nameColorEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === message.author.id;
			var reactions = embedMessage.createReactionCollector(filter, {
				time: 120000
			});
			var emojiNumber = 0;
			reactions.on("collect", async function(reaction) {
				if (reaction.emoji.name === emojiArray[0]) {
					if (emojiNumber !== 0) {
						emojiNumber = emojiNumber - 1;
					} else {
						emojiNumber = colorRoles.length - 1;
					}
				} else if (reaction.emoji.name === emojiArray[1]) {
					if (emojiNumber !== colorRoles.length - 1) {
						emojiNumber = emojiNumber + 1;
					} else {
						emojiNumber = 0;
					}
				}
				await reaction.remove(message.author);
				currentRole = message.guild.roles.find("name", colorRoles[emojiNumber].substr(1).slice(0, -1));
				var nameColorEmbed = new Discord.RichEmbed()
					.setTitle(colorRoles[emojiNumber].substr(1).slice(0, -1))
					.setDescription(`Hex: \`${currentRole.hexColor}\`\nMembers: \`${currentRole.members.size}\``)
					.setColor(currentRole.hexColor);
				embedMessage.edit({
					embed: nameColorEmbed
				});
			});
			reactions.on("end", () => embedMessage.edit("Interactive command ended: 2 minutes passed."));
		});
	} else if (prompt.toLowerCase() === "specify") {
		var prompt2 = await awaitReply(message, "What name color role do you want info on?");
		prompt2 = colorRoles.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new Discord.RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Hex: \`${currentRole.hexColor}\`\nMembers: \`${currentRole.members.size}\``)
				.setColor(currentRole.hexColor);
			message.channel.send({
				embed: roleEmbed
			});
		} else {
			message.reply("Invalid name color role. Check `!info namecolors --> list`.");
		}
	} else {
		endMessage = endMessage.join("\n");
		nameColorEmbed = new Discord.RichEmbed()
			.setTitle("Name colors")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		message.channel.send({
			embed: nameColorEmbed
		});
	}
}

async function howToGetRole(message, Discord, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var obtainableRoles = ["`Story Teller`", "`Dolphin`", "`Meme Master`", "`Inviter`", "`Pro Inviter`", "`Cuber`", "`Artist`", "`Partner`",
		"`Contributor`", "`Supporter`"];
	var descriptions = ["Get part of your story on the starboard.",
		"Tell cj your knowledge about dolphin’s dark deeds and he shall decide if you are worthy of the role.",
		"Get one of your memes on the starboard.",
		"Invite 5 people to this server", "Invite 10 people to this server", "Be able to solve a 3x3 Rubik’s cube in less than 2 minutes.",
		"Get one of your art pieces on the starboard.", "Be the owner of a discord server partnered with us.", "Contribute to the server or assets relating to it",
		"Tip any amount, payment instructions in !info perks"
	];
	if (prompt.toLowerCase() === "preview") {
		var roleEmbed = new Discord.RichEmbed()
			.setTitle(obtainableRoles[0].substr(1).slice(0, -1))
			.setDescription(`Members: \`${message.guild.roles.find("name", obtainableRoles[0].substr(1).slice(0, -1)).members.size}\`\nObtain: \`${descriptions[0]}\``)
			.setColor(message.guild.roles.find("name", obtainableRoles[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		message.channel.send(roleEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === message.author.id;
			var reactions = embedMessage.createReactionCollector(filter, {
				time: 120000
			});
			var emojiNumber = 0;
			reactions.on("collect", async function(reaction) {
				if (reaction.emoji.name === emojiArray[0]) {
					if (emojiNumber !== 0) {
						emojiNumber = emojiNumber - 1;
					} else {
						emojiNumber = obtainableRoles.length - 1;
					}
				} else if (reaction.emoji.name === emojiArray[1]) {
					if (emojiNumber !== obtainableRoles.length - 1) {
						emojiNumber = emojiNumber + 1;
					} else {
						emojiNumber = 0;
					}
				}
				await reaction.remove(message.author);
				currentRole = message.guild.roles.find("name", obtainableRoles[emojiNumber].substr(1).slice(0, -1));
				var roleEmbed = new Discord.RichEmbed()
					.setTitle(obtainableRoles[emojiNumber].substr(1).slice(0, -1))
					.setDescription(`Members: \`${currentRole.members.size}\`\nObtain: \`${descriptions[emojiNumber]}\``)
					.setColor(currentRole.hexColor);
				embedMessage.edit({
					embed: roleEmbed
				});
			});
			reactions.on("end", () => embedMessage.edit("Interactive command ended: 2 minutes passed."));
		});
	} else if (prompt.toLowerCase() === "specify") {
		var prompt2 = await awaitReply(message, "What obtainable role do you want info on?");
		prompt2 = obtainableRoles.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new Discord.RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Members: \`${currentRole.members.size}\`\nObtain: \`${descriptions[obtainableRoles.indexOf(prompt2)]}\``)
				.setColor(currentRole.hexColor);
			message.channel.send({
				embed: roleEmbed
			});
		} else {
			message.reply("Invalid obtainable role. Check `!info howtogetrole --> list`.");
		}
	} else {
		var endMessage = obtainableRoles.join("\n");
		roleEmbed = new Discord.RichEmbed()
			.setTitle("Obtainable Roles")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		message.channel.send({
			embed: roleEmbed
		});
	}
}

async function levelRoles(message, Discord, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var levelRoles = [ "`​Newbie Bro`​", "`​Junior Bro`​", "`​Cool Junior Bro`​", "`​OP Junior Bro`​", "`​Bro`​", "`​Cool Bro`​", "`​OP Bro`​",
		"`​Senior Bro`​", "`​Cool Senior Bro`​", "`​OP Senior Bro`​", "`​Epic Bro`​", "`​Cool Epic Bro`​", "`​OP Epic Bro`​",
		"`​Legendary Bro`​", "`​Cool Legendary Bro`​", "`​OP Legendary Bro`​", "`​Elite Bro`​", "`​Cool Elite Bro`​", "`​OP Elite Bro`​",
		"`​True Bro`​"
	];
	var level = [ "0", "1", "5", "10", "11", "15", "20", "21", "25", "30", "31", "35", "40", "41", "45", "50", "51", "55", "60", "61" ];
	if (prompt.toLowerCase() === "preview") {
		var roleEmbed = new Discord.RichEmbed()
			.setTitle(levelRoles[0].substr(1).slice(0, -1))
			.setDescription(`Members: \`${message.guild.roles.find("name", levelRoles[0].substr(1).slice(0, -1)).members.size}\`\nObtain: \`level ${level[0]}\``)
			.setColor(message.guild.roles.find("name", levelRoles[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		message.channel.send(roleEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === message.author.id;
			var reactions = embedMessage.createReactionCollector(filter, {
				time: 120000
			});
			var emojiNumber = 0;
			reactions.on("collect", async function(reaction) {
				if (reaction.emoji.name === emojiArray[0]) {
					if (emojiNumber !== 0) {
						emojiNumber = emojiNumber - 1;
					} else {
						emojiNumber = levelRoles.length - 1;
					}
				} else if (reaction.emoji.name === emojiArray[1]) {
					if (emojiNumber !== levelRoles.length - 1) {
						emojiNumber = emojiNumber + 1;
					} else {
						emojiNumber = 0;
					}
				}
				await reaction.remove(message.author);
				currentRole = message.guild.roles.find("name", levelRoles[emojiNumber].substr(1).slice(0, -1));
				var roleEmbed = new Discord.RichEmbed()
					.setTitle(levelRoles[emojiNumber].substr(1).slice(0, -1))
					.setDescription(`Members: \`${currentRole.members.size}\`\nObtain: \`level ${level[emojiNumber]}\``)
					.setColor(currentRole.hexColor);
				embedMessage.edit({
					embed: roleEmbed
				});
			});
			reactions.on("end", () => embedMessage.edit("Interactive command ended: 2 minutes passed."));
		});
	} else if (prompt.toLowerCase() === "specify") {
		var prompt2 = await awaitReply(message, "What level role do you want info on?");
		prompt2 = levelRoles.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new Discord.RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Members: \`${currentRole.members.size}\`\nObtain: \`${level[levelRoles.indexOf(prompt2)]}\``)
				.setColor(currentRole.hexColor);
			message.channel.send({
				embed: roleEmbed
			});
		} else {
			message.reply("Invalid level role. Check `!info levelroles --> list`.");
		}
	} else {
		var endMessage = levelRoles.join("\n");
		roleEmbed = new Discord.RichEmbed()
			.setTitle("Obtainable Roles")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		message.channel.send({
			embed: roleEmbed
		});
	}
}

function donate(message) {
	fs.readFile(__dirname + "/../info/perks.md", (err, data) => {
		if (err) {
			throw err;
		} else {
			message.channel.send(data.toString("utf8"));
		}
	});
}

function ad(message, prompt, param) {
	if(param !== undefined) prompt = param;
	fs.readFile(__dirname + "/../info/ad.md", (err, data) => {
		if(err) {
			throw err;
		} else {
			var toSend = data.toString("utf8");
			if(prompt == "computer") toSend = `\`\`\`${toSend}\`\`\``;
			message.channel.send(toSend);
		}
	});
}

async function infoTarget(message, prompt, Discord, choice, param) {
	if (choice.toLowerCase() === "ad" || choice.toLowerCase() === "advertisement") {
		if (param !== "mobile" && param !== "computer") {
			prompt = await awaitReply(message, "Would you like to view the `mobile` ad (not in code block) or `computer` ad (in code block)? Default: Computer");
			ad(message, prompt, undefined);
		} else {
			ad(message, prompt, param);
		}
	} else if (choice.toLowerCase() === "gameroles" || choice.toLowerCase() === "gamerole") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = await awaitReply(message, "Would you like to `preview` all game roles, view a `list` of game roles or `specify` a specific role? Default: List");
			gameRoles(message, Discord, prompt, undefined);
		} else {
			gameRoles(message, Discord, prompt, param);
		}
	} else if (choice.toLowerCase() === "namecolors" || choice.toLowerCase() === "colors") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = await awaitReply(message, "Would you like to `preview` all color roles, view a `list` of color roles or `specify` a specific role? Default: List");
			nameColors(message, Discord, prompt, undefined);
		} else {
			nameColors(message, Discord, prompt, param);
		}
	} else if (choice.toLowerCase() === "getrole" || choice.toLowerCase() === "howtogetrole" || choice.toLowerCase() === "htgr") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = await awaitReply(message, "Would you like to `preview` all obtainable roles, view a `list` of roles or `specify` a specific role? Default: List");
			howToGetRole(message, Discord, prompt, undefined);
		} else {
			howToGetRole(message, Discord, prompt, param);
		}
	} else if (choice.toLowerCase() === "donate" || choice.toLowerCase() === "perks" || choice.toLowerCase() === "tip") {
		donate(message);
	} else if (choice.toLowerCase() === "levelroles" || choice.toLowerCase() === "levels") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = await awaitReply(message, "Would you like to `preview` all obtainable roles, view a `list` of roles or `specify` a specific role? Default: List");
			levelRoles(message, Discord, prompt, undefined);
		} else {
			levelRoles(message, Discord, prompt, param);
		}
	}
}

module.exports = {
	id: "info",
	aliases: ["information"],
	load: () => {},
	execute: (call) => {
		var prompt;
		var choice = call.params.readParameter();
		var param = call.params.readParameter();
		var options = ["ad", "advertisement", "gamerole", "gameroles", "namecolors", "colors", "getrole", "howtogetrole", "htgr",
			"donate", "perks", "tip", "levelroles", "levels"
		];
		var plainOptions = ["advertisement", "gameroles", "namecolors", "howtogetrole", "perks", "levelroles"];
		if(choice === null) {
			awaitReply(call.message, `Specify the information you want. Choices: \`${plainOptions.join("`, `")}\`.`).then(userChoice => {
				if(!options.includes(userChoice.toLowerCase())) {
					call.message.reply(`Invalid choice. Choices are: \`${plainOptions.join("`, `")}\`.`);
				} else {
					infoTarget(call.message, prompt, Discord, userChoice, param);
				}
			});
		} else {
			if(!options.includes(choice.toLowerCase())) {
				call.message.reply(`Invalid choice. Choices are: \`${plainOptions.join("`, `")}\`.`);
			} else {
				infoTarget(call.message, prompt, Discord, choice, param);
			}
		}
	}
};
