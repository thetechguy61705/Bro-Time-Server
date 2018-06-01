const { RichEmbed } = require("discord.js");
const fs = require("fs");

async function gameRoles(call, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var games = ["`Roblox`", "`Minecraft`", "`Cuphead`", "`Fortnite`", "`Undertale`", "`Unturned`", "`VRChat`",
		"`PUBG`", "`FNAF`", "`Clash of Clans`", "`Clash Royale`", "`Sims`", "`Terraria`", "`Subnautica`", "`Rocket League`",
		"`Portal`", "`Hat in Time`", "`CSGO`", "`Splatoon`", "`Mario`", "`Starbound`", "`Garry's Mod`", "`Overwatch`",
		"`Call of Duty`", "`Destiny`", "`Psych`", "`Bro Time Games`"
	];
	if (prompt.toLowerCase() === "preview") {
		var gameRoleEmbed = new RichEmbed()
			.setTitle(games[0].substr(1).slice(0, -1))
			.setDescription(`Players: \`${call.message.guild.roles.find("name", games[0].substr(1).slice(0, -1)).members.size}\``)
			.setColor(call.message.guild.roles.find("name", games[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		call.message.channel.send(gameRoleEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === call.message.author.id;
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
				await reaction.remove(call.message.author);
				currentRole = call.message.guild.roles.find("name", games[emojiNumber].substr(1).slice(0, -1));
				var gameRoleEmbed = new RichEmbed()
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
		var prompt2 = (await call.requestInput(0, "What game role do you want info on?", 60000)).message.content;
		prompt2 = games.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = call.message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Players: \`${currentRole.members.size}\``)
				.setColor(currentRole.hexColor);
			call.message.channel.send({
				embed: roleEmbed
			});
		} else {
			call.message.reply("Invalid game role. Check `!info gameroles --> list`.");
		}
	} else {
		var endMessage = games.join("\n");
		gameRoleEmbed = new RichEmbed()
			.setTitle("Gameroles")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		call.message.channel.send({
			embed: gameRoleEmbed
		});
	}
}

async function nameColors(call, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var endMessage = ["`Black`", "`White`", "`Red`", "`BrightRed`", "`Orange`", "`Bronze`", "`Gold`", "`HotBrown`",
		"`Salmon`", "`Yellow`", "`Green`", "`DarkGreen`", "`LimeGreen`", "`LightGreen`", "`Blue`", "`GrayBlue`",
		"`Cyan`", "`Purple`", "`Indigo`", "`DarkViolet`", "`Magenta`", "`HotPink`", "`Pink`", "`Invisible`", "`Multicolored`"];

	var colorRoles = ["`Black`", "`White`", "`Red`", "`BrightRed`", "`Orange`", "`Bronze`", "`Gold`", "`HotBrown`",
		"`Salmon`", "`Yellow`", "`Green`", "`DarkGreen`", "`LimeGreen`", "`LightGreen`", "`Blue`", "`GrayBlue`",
		"`Cyan`", "`Purple`", "`Indigo`", "`DarkViolet`", "`Magenta`", "`HotPink`", "`Pink`", "`Invisible`", "`Multicolored`"];

	if (prompt.toLowerCase() === "preview") {
		currentRole = call.message.guild.roles.find("name", colorRoles[0].substr(1).slice(0, -1));
		var nameColorEmbed = new RichEmbed()
			.setTitle(colorRoles[0].substr(1).slice(0, -1))
			.setDescription(`Hex: \`${currentRole.hexColor}\`\nMembers: \`${currentRole.members.size}\``)
			.setColor(call.message.guild.roles.find("name", colorRoles[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		call.message.channel.send(nameColorEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === call.message.author.id;
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
				await reaction.remove(call.message.author);
				currentRole = call.message.guild.roles.find("name", colorRoles[emojiNumber].substr(1).slice(0, -1));
				var nameColorEmbed = new RichEmbed()
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
		var prompt2 = (await call.requestInput(0, "What name color role do you want info on?", 60000)).message.content;
		prompt2 = colorRoles.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = call.message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Hex: \`${currentRole.hexColor}\`\nMembers: \`${currentRole.members.size}\``)
				.setColor(currentRole.hexColor);
			call.message.channel.send({
				embed: roleEmbed
			});
		} else {
			call.message.reply("Invalid name color role. Check `!info namecolors --> list`.");
		}
	} else {
		endMessage = endMessage.join("\n");
		nameColorEmbed = new RichEmbed()
			.setTitle("Name Colors")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		call.message.channel.send({
			embed: nameColorEmbed
		});
	}
}

async function howToGetRole(call, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var obtainableRoles = ["`Story Teller`", "`Dolphin`", "`Meme Master`", "`Inviter`", "`Pro Inviter`", "`Cuber`", "`Artist`", "`Partner`",
		"`Contributor`", "`Supporter`", "`Bug Smasher`"];
	var descriptions = ["Get part of your story on the starboard.",
		"Tell cj your knowledge about dolphin’s dark deeds and he shall decide if you are worthy of the role.",
		"Get one of your memes on the starboard.",
		"Invite 5 people to this server", "Invite 10 people to this server", "Be able to solve a 3x3 Rubik’s cube in less than 2 minutes.",
		"Get one of your art pieces on the starboard.", "Be the owner of a discord server partnered with us.", "Contribute to the server or assets relating to it",
		"Tip any amount, payment instructions in !info perks",
		"Report an unknown bug to a developer of Bro Bot"
	];
	if (prompt.toLowerCase() === "preview") {
		var roleEmbed = new RichEmbed()
			.setTitle(obtainableRoles[0].substr(1).slice(0, -1))
			.setDescription(`Members: \`${call.message.guild.roles.find("name", obtainableRoles[0].substr(1).slice(0, -1)).members.size}\`\nObtain: \`${descriptions[0]}\``)
			.setColor(call.message.guild.roles.find("name", obtainableRoles[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		call.message.channel.send(roleEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === call.message.author.id;
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
				await reaction.remove(call.message.author);
				currentRole = call.message.guild.roles.find("name", obtainableRoles[emojiNumber].substr(1).slice(0, -1));
				var roleEmbed = new RichEmbed()
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
		var prompt2 = (await call.requestInput(0, "What obtainable role do you want info on?", 60000)).message.content;
		prompt2 = obtainableRoles.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = call.message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Members: \`${currentRole.members.size}\`\nObtain: \`${descriptions[obtainableRoles.indexOf(prompt2)]}\``)
				.setColor(currentRole.hexColor);
			call.message.channel.send({
				embed: roleEmbed
			});
		} else {
			call.message.reply("Invalid obtainable role. Check `!info howtogetrole --> list`.");
		}
	} else {
		var endMessage = obtainableRoles.join("\n");
		roleEmbed = new RichEmbed()
			.setTitle("Obtainable Roles")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		call.message.channel.send({
			embed: roleEmbed
		});
	}
}

async function levelRoles(call, prompt, param) {
	if (param !== undefined) prompt = param;
	var currentRole;
	var levelRoles = [ "`​Newbie Bro`​", "`​Junior Bro`​", "`​Cool Junior Bro`​", "`​OP Junior Bro`​", "`​Bro`​", "`​Cool Bro`​", "`​OP Bro`​",
		"`​Senior Bro`​", "`​Cool Senior Bro`​", "`​OP Senior Bro`​", "`​Epic Bro`​", "`​Cool Epic Bro`​", "`​OP Epic Bro`​",
		"`​Legendary Bro`​", "`​Cool Legendary Bro`​", "`​OP Legendary Bro`​", "`​Elite Bro`​", "`​Cool Elite Bro`​", "`​OP Elite Bro`​",
		"`​True Bro`​"
	];
	var level = [ "0", "1", "5", "10", "11", "15", "20", "21", "25", "30", "31", "35", "40", "41", "45", "50", "51", "55", "60", "61" ];
	if (prompt.toLowerCase() === "preview") {
		var roleEmbed = new RichEmbed()
			.setTitle(levelRoles[0].substr(1).slice(0, -1))
			.setDescription(`Members: \`${call.message.guild.roles.find("name", levelRoles[0].substr(1).slice(0, -1)).members.size}\`\nObtain: \`level ${level[0]}\``)
			.setColor(call.message.guild.roles.find("name", levelRoles[0].substr(1).slice(0, -1)).hexColor);
		var emojiArray = ["◀", "▶"];
		call.message.channel.send(roleEmbed).then(async function(embedMessage) {
			var orderLoop = 0;
			while (orderLoop != emojiArray.length) {
				await embedMessage.react(emojiArray[orderLoop]);
				orderLoop = orderLoop + 1;
			}
			const filter = (reaction, user) => emojiArray.includes(reaction.emoji.name) && user.id === call.message.author.id;
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
				await reaction.remove(call.message.author);
				currentRole = call.message.guild.roles.find("name", levelRoles[emojiNumber].substr(1).slice(0, -1));
				var roleEmbed = new RichEmbed()
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
		var prompt2 = (await call.requestInput(0, "What level role do you want info on?", 60000)).message.content;
		prompt2 = levelRoles.find(function(role) {
			return role.toLowerCase().substr(1).slice(0, -1).startsWith(prompt2.toLowerCase());
		});
		if (prompt2 !== undefined) {
			currentRole = call.message.guild.roles.find("name", prompt2.substr(1).slice(0, -1));
			let roleEmbed = new RichEmbed()
				.setTitle(prompt2.substr(1).slice(0, -1))
				.setDescription(`Members: \`${currentRole.members.size}\`\nObtain: \`${level[levelRoles.indexOf(prompt2)]}\``)
				.setColor(currentRole.hexColor);
			call.message.channel.send({
				embed: roleEmbed
			});
		} else {
			call.message.reply("Invalid level role. Check `!info levelroles --> list`.");
		}
	} else {
		var endMessage = levelRoles.join("\n");
		roleEmbed = new RichEmbed()
			.setTitle("Obtainable Roles")
			.setDescription(endMessage)
			.setColor(0x00AE86);
		call.message.channel.send({
			embed: roleEmbed
		});
	}
}

function donate(call) {
	fs.readFile(__dirname + "/../../info/perks.md", (err, data) => {
		if (err) {
			throw err;
		} else {
			call.message.channel.send(data.toString("utf8"));
		}
	});
}

function ad(call, prompt, param) {
	if(param !== undefined) prompt = param;
	fs.readFile(__dirname + "/../../info/ad.md", (err, data) => {
		if(err) {
			throw err;
		} else {
			var toSend = data.toString("utf8");
			if(prompt == "computer") toSend = `\`\`\`${toSend}\`\`\``;
			call.message.channel.send(toSend);
		}
	});
}

async function infoTarget(call, prompt, choice, param) {
	if (choice.toLowerCase() === "ad" || choice.toLowerCase() === "advertisement") {
		if (param !== "mobile" && param !== "computer") {
			prompt = (await call.requestInput(0, "Would you like to view the `mobile` ad (not in code block) or `computer` ad (in code block)? Default: Computer", 60000)).message.content;
			ad(call, prompt, undefined);
		} else {
			ad(call, prompt, param);
		}
	} else if (choice.toLowerCase() === "gameroles" || choice.toLowerCase() === "gamerole") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = (await call.requestInput(0, "Would you like to `preview` all game roles, view a `list` of game roles or `specify` a specific role? Default: List", 60000)).message.content;
			gameRoles(call, prompt, undefined);
		} else {
			gameRoles(call, prompt, param);
		}
	} else if (choice.toLowerCase() === "namecolors" || choice.toLowerCase() === "colors") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = (await call.requestInput(0, "Would you like to `preview` all color roles, view a `list` of color roles or `specify` a specific role? Default: List", 60000)).message.content;
			nameColors(call, prompt, undefined);
		} else {
			nameColors(call, prompt, param);
		}
	} else if (choice.toLowerCase() === "getrole" || choice.toLowerCase() === "howtogetrole" || choice.toLowerCase() === "htgr") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = (await call.requestInput(0, "Would you like to `preview` all obtainable roles, view a `list` of roles or `specify` a specific role? Default: List", 60000)).message.content;
			howToGetRole(call, prompt, undefined);
		} else {
			howToGetRole(call, prompt, param);
		}
	} else if (choice.toLowerCase() === "donate" || choice.toLowerCase() === "perks" || choice.toLowerCase() === "tip") {
		donate(call);
	} else if (choice.toLowerCase() === "levelroles" || choice.toLowerCase() === "levels") {
		if (param !== "preview" && param !== "list" && param !== "specify") {
			prompt = (await call.requestInput(0, "Would you like to `preview` all obtainable roles, view a `list` of roles or `specify` a specific role? Default: List", 60000)).message.content;
			levelRoles(call, prompt, undefined);
		} else {
			levelRoles(call, prompt, param);
		}
	}
}

module.exports = {
	id: "info",
	aliases: ["information"],
	description: "Returns information on the specified topic, if the topic is gameroles, ad, donate, namecolors, levelroles or howtogetrole.",
	arguments: "(option)",
	execute: (call) => {
		var prompt;
		var choice = call.params.readParameter();
		var param = call.params.readParameter();
		var options = ["ad", "advertisement", "gamerole", "gameroles", "namecolors", "colors", "getrole", "howtogetrole", "htgr",
			"donate", "perks", "tip", "levelroles", "levels"
		];
		var plainOptions = ["advertisement", "gameroles", "namecolors", "howtogetrole", "perks", "levelroles"];
		if(choice === null) {
			call.requestInput(0, `Specify the information you want. Choices: \`${plainOptions.join("`, `")}\`.`, 60000).then((userChoice) => {
				if(!options.includes(userChoice.message.content.toLowerCase())) {
					call.message.reply(`Invalid choice. Choices are: \`${plainOptions.join("`, `")}\`.`);
				} else {
					infoTarget(call, prompt, userChoice.message.content, param);
				}
			});
		} else {
			if(!options.includes(choice.toLowerCase())) {
				call.message.reply(`Invalid choice. Choices are: \`${plainOptions.join("`, `")}\`.`);
			} else {
				infoTarget(call, prompt, choice, param);
			}
		}
	}
};
