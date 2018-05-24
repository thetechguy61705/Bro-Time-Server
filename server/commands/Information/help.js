const Discord = require("discord.js");

function add(command, help, prefix) {
	var category = command.category || "Other";
	var array = help[category];
	if (array == null) {
		array = [];
		help[category] = array;
	}
	if (command.arguments != null) {
		array.push(`\`${prefix}${command.id} ${command.arguments}\``);
	} else {
		array.push(`\`${prefix}${command.id}\``);
	}
}

module.exports = {
	id: "help",
	aliases: ["?", "h"],
	description: "Returns information and commands on the bot.",
	arguments: "[command]",
	execute: (call) => {
		const pfx = (message.guild || message.channel).data.prefix;
		var param1 = call.params.readRaw();
		var helpEmbed;
		if (param1 == "") {
			var commandHelp = {};

			call.commands.loaded.array()
				.sort((a, b) => {
					return a.id.localeCompare(b.id);
				})
				.forEach((command) => {
					add(command, commandHelp, pfx);
				});

			helpEmbed = new Discord.RichEmbed()
				.setTitle("Commands")
				.setDescription(`Prefix: \`${pfx}\`\nUptime: ${call.client.uptime.expandPretty()}`)
				.setColor(0x00AE86)
				.setFooter(`Ran by ${call.message.author.username} (${call.message.author.id})`, call.message.author.displayAvatarURL);
			for (var [category, commands] of Object.entries(commandHelp)) {
				helpEmbed.addField(category, commands.join("\n"));
			}
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
