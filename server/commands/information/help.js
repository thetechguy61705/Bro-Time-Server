const Discord = require("discord.js");

module.exports = {
	id: "help",
	load: () => {},
	execute: (call) => {
		var pfx = call.message.data.prefix;
		var param1 = call.params.readRaw();
		var helpembed;
		if(param1 == null || param1 == undefined || param1 == "") {
			helpembed = new Discord.RichEmbed()
				.setTitle("Commands")
				.setDescription(`Prefix: \`${pfx}\`\nUptime: \`soon™\``)
				.setColor(0x00AE86)
				.setFooter(`Ran by ${call.message.author.username} (${call.message.author.id})`, call.message.author.displayAvatarURL)
				.addField("Information Commands", `\`${pfx}help [command]\`\n\`${pfx}ping\`\n\`${pfx}info [topic]\`\n\`${pfx}uptime\``)
				.addField("Role Commands", `\`${pfx}freerole (freerole)\`\n\`${pfx}gamerole (game)\`\n\`${pfx}namecolor (color)\`` +
					`\n\`${pfx}poll (title) (options)\``)
				.addField("Posting Commands", `\`${pfx}postqotd (qotd)\`\n\`${pfx}postgamenight\`` +
					`\n\`${pfx}giveaway (prize): (time) (channel) (winners)\``)
				.addField("Moderation Commands", `\`${pfx}mt (role)\`\n\`${pfx}ban (user)\`\n\`${pfx}kick (user)\`\n\`${pfx}softban (user)\`` +
					`\n\`${pfx}mute (user) (time)\`\n\`${pfx}warn (user) (reason)\`\n\`${pfx}role (option/user) (role)\``)
				.addField("Donator Commands", `\`${pfx}customcolor\``);
			call.message.channel.send({
				embed: helpembed
			}).catch(() => {
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
				helpembed = new Discord.RichEmbed()
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
			if (helpembed != undefined) {
				call.message.channel.send({
					embed: helpembed
				}).catch(() => {
					call.message.author
						.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`)
						.catch(function() {});
				});
			}
		}
	}
};
