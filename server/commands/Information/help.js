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
		const data = (call.message.guild || call.message.channel).data;
		const prefix = data != null ? data.prefix : "help";
		const param1 = (call.params.readRaw() !== "" && call.params.readRaw() != null) ? call.params.readRaw() : "";
		var helpEmbed = new Discord.RichEmbed()
			.setColor(0x00AE86)
			.setFooter(`Ran by ${call.message.author.username} (${call.message.author.id})`, call.message.author.displayAvatarURL);
		var commandHelp = {};

		if (param1 === "") {
			call.commands.loaded.array().sort((a, b) => {
				return a.id.localeCompare(b.id);
			}).forEach((command) => {
				add(command, commandHelp, prefix);
			});

			helpEmbed.setTitle("Commands").setDescription(`Prefix: \`${prefix}\`\nUptime: ${call.client.uptime.expandPretty()}`);
			for (var [category, commands] of Object.entries(commandHelp)) {
				helpEmbed.addField(category, commands.join("\n"));
			}
			call.message.channel.send({ embed: helpEmbed }).catch(() => {
				call.message.author.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`).catch(() => {});
			});
		} else if (call.commands.loaded.map((cmd) => cmd.id).includes(param1.toLowerCase())) {
			const command = call.commands.loaded.get(param1.toLowerCase()),
				aliases = (command.aliases != null) ? command.aliases : ["None"],
				cmdDesc = (command.description != null) ? command.description : "None",
				cmdUsage = (command.arguments != null) ? " " + command.arguments : "",
				cmdReq = (command.requires != null) ? command.requires : "None";
			helpEmbed.setTitle(`${prefix}${param1}`).setDescription(`Purpose: ${cmdDesc}` +
				`\nUsage: \`${prefix}${param1}${cmdUsage}\`` +
				`\nRequires: \`${cmdReq}\`` +
				`\nAliases: \`${aliases.join("`, `")}\``);
		} else {
			call.message.reply("Invalid command name. Please run `!help (command)` or just `!help`").catch(() => {
				call.message.author.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak there.`)
					.catch(() => {});
			});
		}
		if (helpEmbed.description != null) {
			call.message.channel.send({ embed: helpEmbed }).catch(() => {
				call.message.author.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`).catch(() => {});
			});
		}
	}
};
