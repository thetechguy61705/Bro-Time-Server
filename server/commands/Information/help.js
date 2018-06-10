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
	paramsHelp: "[command]",
	execute: (call) => {
		const data = (call.message.guild || call.message.channel).data;
		const prefix = data != null ? data.prefix : "help";
		const param1 = (call.params.readRaw() !== "" && call.params.readRaw() != null) ? call.params.readRaw() : "";
		const command = call.commands.loaded.find(cmd => (cmd.aliases || []).concat(cmd.id).includes(param1.toLowerCase()));
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

			helpEmbed.setTitle("Information").setDescription(`Prefix: \`${prefix}\`\nUptime: ${call.client.uptime.expandPretty()}\n` +
				"[GitHub URL](https://github.com/Bro-Time/Bro-Time-Server)");
			for (var [category, commands] of Object.entries(commandHelp)) {
				helpEmbed.addField(category, commands.join("\n"));
			}
		} else if (command != null) {
			const { aliases, description, paramsHelp, requires, id } = command;
			helpEmbed.setTitle(`${prefix}${id}`).setDescription(`Purpose: ${(description || "None")}` +
				`\nUsage: \`${prefix}${id} ${(paramsHelp || "")}\`` +
				`\nRequires: \`${(requires || "None")}\`` +
				`\nAliases: \`${(aliases || ["None"]).join("`, `")}\`` +
				`\nCategory: \`${command.category}\`` +
				`\n\n[GitHub URL](https://github.com/Bro-Time/Bro-Time-Server/tree/master/server/commands/${(command.category !== "Other") ? command.category + "/" : ""}${id})`);
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
