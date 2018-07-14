const Discord = require("discord.js");
const { DataRequest } = require("@utility/datarequest.ts");

function add(command, help, prefix) {
	var category = command.category || "Other";
	var array = help[category];
	if (array == null) {
		array = [];
		help[category] = array;
	}
	if (command.paramsHelp != null) {
		array.push(`\`${prefix}${command.id} ${command.paramsHelp}\``);
	} else {
		array.push(`\`${prefix}${command.id}\``);
	}
}

module.exports = {
	id: "help",
	aliases: ["?", "h"],
	description: "Returns information and commands on the bot.",
	paramsHelp: "[command]",
	access: "Public",
	execute: async (call) => {
		const commandFilter = (cmd) => {
			if (call.message.channel.type === "dm" && ["Private", "Public"].includes(cmd.access)) return true;
			if (call.message.channel.type === "text" && ["Server", "Public", undefined].includes(cmd.access)) return true;
			return false;
		};
		const prefix = await DataRequest.getPrefix(call.message.guild.id);
		const param1 = (call.params.readRaw() !== "" && call.params.readRaw() != null) ? call.params.readRaw() : "";
		const command = call.commands.loaded.find((cmd) => (cmd.aliases || []).concat(cmd.id).includes(param1.toLowerCase()));
		var helpEmbed = new Discord.RichEmbed()
			.setColor(0x00AE86)
			.setDefaultFooter(call.message.author);
		var commandHelp = {};

		if (param1 === "") {
			var sortedCommands = call.commands.loaded.array().sort((a, b) => a.id.localeCompare(b.id));

			for (var sortedCmd of sortedCommands) {
				if (commandFilter(sortedCmd)) add(sortedCmd, commandHelp, prefix);
			}

			helpEmbed.setTitle("Information")
				.setDescription(`Prefix: \`${prefix}\`\n` +
					`Uptime: ${call.client.uptime.expandPretty()}\n` +
					`Shard: \`${call.client.shard.id}\`\n` +
					"[GitHub URL](https://github.com/Bro-Time/Bro-Time-Server)");
			for (var [category, commands] of Object.entries(commandHelp)) {
				helpEmbed.addField(category, commands.join("\n"));
			}
		} else if (command != null) {
			const { aliases, description, paramsHelp, requires, id, file } = command;
			helpEmbed.setTitle(`${prefix}${id}`).setDescription(`Purpose: ${(description || "None")}` +
				`\nUsage: \`${prefix}${id} ${(paramsHelp || "")}\`` +
				`\nRequires: \`${(requires || "None")}\`` +
				`\nAliases: \`${(aliases || ["None"]).join("`, `")}\`` +
				`\nCategory: \`${command.category}\`` +
				"\n\n[GitHub URL](https://github.com/Bro-Time/Bro-Time-Server/tree/master/server/commands/" +
					`${(command.category !== "Other") ? command.category.replace(/\s/g, "%20") + "/" : ""}${file}.js)`)
				.setDefaultFooter(call.message.author);
		} else {
			call.safeSend("Invalid command name. Please run `!help (command)` or just `!help`");
		}
		if (helpEmbed.description != null) {
			call.safeSend(null, call.message, { embed: helpEmbed });
		}
	}
};
