const Discord = require("discord.js");

module.exports = {
	id: "warn",
	load: () => {},
	execute: (call) => {
		const rawContent = call.params.readRaw();
		const parameterOne = rawContent.split(" ")[0];
		const parameterTwo = rawContent.split(" ")[1];
		const modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		if (call.message.member.roles.some(role => modRoles.includes(role.id))) {
			const target = call.message.guild.members
				.find(member => parameterOne.includes(member.user.id) || member.user.tag.toLowerCase().startsWith(parameterOne.toLowerCase()));
			if (target !== null) {
				var reason;
				if (parameterTwo != undefined) {
					reason = "`" + rawContent.substr(parameterOne.length + 1) + "`";
				} else {
					reason = "`No reason specified.`";
				}
				target.send(`You have been banned from the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}`).then(() => {
					call.message.channel.send(`***Successfully warned \`${target.user.tag}\`.***`).catch(function() {});
					const warnEmbed = new Discord.RichEmbed()
						.setAuthor(target.tag, target.avatarURL)
						.setDescription(reason)
						.setFooter(`Warned by ${call.message.author.tag} (${call.message.author.id})`)
						.setTimestamp();
					call.client.channels.get("436353363786072104").send({ embed: warnEmbed }).catch(function() {});
				});
			} else {
				call.message.reply("Please supply a valid user tag, mention, or id.").catch(() => {
					call.message.author.send(`You attempted to use the \`warn\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`warn\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
