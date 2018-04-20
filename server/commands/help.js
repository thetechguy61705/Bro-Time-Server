const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
	id: "help",
	load: () => {},
	execute: (call) => {
		var pfx = call.message.data.prefix;
		var param1 = call.params.readRaw();
		var cmdNames = ["help", "ping", "freerole", "gamerole", "namecolor", "postqotd", "postgamenight", "customcolor",
			"mt", "info", "ban", "kick", "softban", "mute", "warn", "poll", "uptime", "role"];
		var cmdUsage = [" [command]", "", " (free role)", " (game role)", " (color role)", " (qotd)", "...prompt",
			"...prompt", " (role name)", " (information topic)", "(user) [reason]", "(user) [reason]",
			"(user) [reason]", "(user) [time]", "(user) [reason]", "(title): (options seperated by |)", "(option/user) (role(s))"];
		var cmdReq = ["Nothing", "Nothing", "Nothing", "Nothing", "Nothing/Bro Time Plus/Bro Time Premium/Bro Time Deluxe",
			"Role: QOTD Host", "Role: Game Night Host", "Donator", "Moderator permissions", "Nothing", "Moderator permissions",
			"Moderator permissions", "Moderator permissions", "Moderator permissions", "Moderator permissions", "Nothing", "Nothing",
			"Moderator permissions"];
		var helpembed;
		var cmdDescs;
		if(param1 == null || param1 == undefined || param1 == "") {
			helpembed = new Discord.RichEmbed()
				.setTitle("Commands")
				.setDescription(`Prefix: \`${pfx}\`\nUptime: \`soon™\``)
				.setColor(0x00AE86)
				.setFooter(`Ran by ${call.message.author.username} (${call.message.author.id})`, call.message.author.displayAvatarURL)
				.addField("Information Commands", `\`${pfx}help [command]\`\n\`${pfx}ping\`\n\`${pfx}info [topic]\`\n\`${pfx}uptime\``)
				.addField("Role Commands", `\`${pfx}freerole (freerole)\`\n\`${pfx}gamerole (game)\`\n\`${pfx}namecolor (color)\`` +
					`\n\`${pfx}poll (title) (options)\``)
				.addField("Posting Commands", `\`${pfx}postqotd (qotd)\`\n\`${pfx}postgamenight\``)
				.addField("Moderation Commands", `\`${pfx}mt (role)\`\n\`${pfx}ban (user)\`\n\`${pfx}kick (user)\`\n\`${pfx}softban (user)\`` +
					`\n\`${pfx}mute (user) (time)\`\n${pfx}warn (user) (reason)\`\n\`${pfx}role (option/user) (role)\``)
				.addField("Donator Commands", `\`${pfx}customcolor\``);
			call.message.channel.send({
				embed: helpembed
			}).catch(() => {
				call.message.author.send(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`)
					.catch(function() {});
			});
		} else {
			param1 = param1.toLowerCase();
			fs.readFile(__dirname + "/../info/commandinfo.md", (err, data) => {
				if(err) {
					throw err;
				} else {
					cmdDescs = data.toString("utf8").split("\n");
					if(cmdNames.includes(param1.toLowerCase())) {
						var aliases = require(`./${param1.toLowerCase()}`).aliases;
						if (aliases == null) aliases = ["None"];
						var num = cmdNames.indexOf(param1);
						helpembed = new Discord.RichEmbed()
							.setTitle(`${pfx}${param1}`)
							.setDescription(`Purpose: ${cmdDescs[num]}` +
								`\nUsage: \`${pfx}${param1}${cmdUsage[num]}\``+
								`\nRequires: \`${cmdReq[num]}\`` +
								`\nAliases: \`${aliases.join("`, `")}\`.`)
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
			});
		}
	}
};
