const Discord = require("discord.js");

module.exports = {
	id: "help",
	aliases: ["h"],
	description: "Returns information and commands on the bot.",
	arguments: "[command]",
	load: () => {},
	execute: (call) => {
		var pfx = call.message.data.prefix;
		var param1 = call.params.readRaw();
		var helpEmbed;
		const categories = ["Donator", "Posting", "Information", "Roles", "Utility"];
		console.log(call.commands.loaded);
		if (param1 == null || param1 == undefined || param1 == "") {
			helpEmbed = new Discord.RichEmbed()
				.setTitle("Commands")
				.setDescription(`Prefix: \`${pfx}\`\nUptime: \`soon™\``)
				.setColor(0x00AE86)
				.setFooter(`Ran by ${call.message.author.username} (${call.message.author.id})`, call.message.author.displayAvatarURL);
			categories.forEach(category => {
				helpEmbed.addField(category, call.commands.loaded.filter(cmd => cmd.categories[0] === category.toLowerCase()).map(cmd => {
					if (cmd.arguments != null) {
						return `${pfx}${cmd.id}${cmd.arguments}`;
					} else {
						return `${pfx}${cmd.id}`;
					}
				}).join("\n"));
			});
			call.message.channel.send({ embed: helpEmbed }).catch(() => {
				call.message.author.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`)
					.catch(function() {});
			});
		} else {
			param1 = param1.toLowerCase();
			if (call.commands.loaded.map(cmd => cmd.id).includes(param1.toLowerCase())) {
				const command = call.commands.loaded.get(param1.toLowerCase());
				var aliases = command.aliases;
				if (aliases == null) aliases = ["None"];
				var cmdDesc = command.description;
				if (cmdDesc == null) cmdDesc = "None";
				var cmdUsage = " " + command.arguments;
				if (cmdUsage == null) cmdUsage = "";
				var cmdReq = command.requires;
				if (cmdReq == null) cmdReq = "None";
				helpEmbed = new Discord.RichEmbed()
					.setTitle(`${pfx}${param1}`)
					.setDescription(`Purpose: ${cmdDesc}` +
						`\nUsage: \`${pfx}${param1}${cmdUsage}\``+
						`\nRequires: \`${cmdReq}\`` +
						`\nAliases: \`${aliases.join("`, `")}\``)
					.setColor(0x00AE86);
			} else {
				call.message.reply("Invalid command name. Please run `!help (command)` or just `!help`").catch(() => {
					call.message.author.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak there.`)
						.catch(function() {});
				});
			}
			if (helpEmbed != undefined) {
				call.message.channel.send({ embed: helpEmbed }).catch(() => {
					call.message.author
						.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`)
						.catch(function() {});
				});
			}
		}
	}
};
