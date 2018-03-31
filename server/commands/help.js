const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
	id: "help",
	load: () => {},
	execute: (call) => {
		var pfx = call.message.data.prefix;
		var param1 = call.params.readRaw();
		var cmdNames = ["help", "ping", "freerole", "gamerole", "namecolor", "postqotd", "postgamenight", "customcolor",
			"mt", "info"];
		var cmdUsage = [" [command]", "", " (free role)", " (game role)", " (color role)", " (qotd)", "...prompt",
			"...prompt", " (role name)", " (information topic)"];
		var cmdReq = ["Nothing", "Nothing", "Nothing", "Nothing", "Nothing/Bro Time Plus/Bro Time Premium/Bro Time Deluxe",
			"Role: QOTD Host", "Role: Game Night Host", "Donator", "Moderator permissions", "Nothing"];
		var helpembed;
		var cmdDescs;
		if(param1 == null || param1 == undefined || param1 == "") {
			helpembed = new Discord.RichEmbed()
				.setTitle("Commands")
				.setDescription("Hey! I'm Bro Bot. My developers stride to keep Bro Time as simple (and fun) as possible.")
				.setColor(0x00AE86)
				.setFooter(`Run by ${call.message.author.username}`, call.message.author.avatarURL)
				.addField("Information Commands", `\`${pfx}help [command]\`\n\`${pfx}ping\`\n\`${pfx}info [topic]\``)
				.addField("Role Commands", `\`${pfx}freerole (freerole)\`\n\`${pfx}gamerole (game)\`\n\`${pfx}namecolor (color)\``)
				.addField("Event Posting Commands", `\`${pfx}postqotd (qotd)\`\n\`${pfx}postgamenight\``)
				.addField("Utility Commands", `\`${pfx}mt (role)\``)
				.addField("Donator Commands", `\`${pfx}customcolor\``);
			call.message.channel.send({
				embed: helpembed
			}).catch(() => {
				call.message.author(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`)
					.catch();
			});
		} else {
			param1 = param1.toLowerCase();
			fs.readFile(__dirname + "/../info/commandinfo.md", (err, data) => {
				if(err) {
					throw err;
				} else {
					cmdDescs = data.toString("utf8").split("\n");
					if(cmdNames.includes(param1)) {
						var num = cmdNames.indexOf(param1);
						helpembed = new Discord.RichEmbed()
							.setTitle(`${pfx}${param1}`)
							.setDescription(`Purpose: ${cmdDescs[num]}\nUsage: \`${pfx}${param1}${cmdUsage[num]}\`\nRequires: \`${cmdReq[num]}\``)
							.setColor(0x00AE86);
					} else {
						call.message.reply("Invalid command name. Please run `!help (command)` or just `!help`").catch(() => {
							call.message.author(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak there.`)
								.catch();
						});
					}
					if (helpembed != undefined) {
						call.message.channel.send({
							embed: helpembed
						}).catch(() => {
							call.message.author(`You attempted to run the \`!help\` command in ${call.message.channel}, but I can not speak and/or send embeds there.`)
								.catch();
						});
					}
				}
			});
		}
	}
};
