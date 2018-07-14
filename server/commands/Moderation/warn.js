const Discord = require("discord.js");
const Moderator = require("@utility/moderator");

module.exports = {
	id: "warn",
	description: "Sends the user a dm with the supplied reason.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	access: "Server",
	execute: async (call) => {
		const rawContent = call.params.readRaw(),
			parameterOne = (call.params.readParam() || ""),
			parameterTwo = (call.params.readParam() || "");
		if (Moderator(call.message.member)) {
			if (parameterOne != "") {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				const target = guild.members.find((member) => parameterOne.includes(member.user.id) || member.user.tag.toLowerCase().startsWith(parameterOne.toLowerCase()));
				if (target != null) {
					if (!target.user.bot) {
						if (target.highestRole.position < call.message.member.highestRole.position) {
							var reason = (parameterTwo !== "") ? "`" + rawContent.substr(parameterOne.length + 1) + "`" : "`No reason specified.`";
							try {
								await target.send(`You have been warned in the \`${guild.name}\` server by \`${call.message.author.tag}\` for ${reason}.`);
							} catch (err) {
								console.warn(err.stack);
							}

							call.message.channel.send(`***Successfully warned \`${target.user.tag}\`.***`);
							var warnEmbed = new Discord.RichEmbed().setAuthor(target.user.tag, target.user.displayAvatarURL).setDescription(reason.substr(1).slice(0, -1))
								.setFooter(`Warned by ${call.message.author.tag} (${call.message.author.id})`)
								.setColor("ORANGE")
								.setTimestamp();
							call.client.channels.get("436353363786072104").send({ embed: warnEmbed });
						} else call.safeSend("Specified user is too high in this guild's hierarchy to be warned by you.");
					} else call.safeSend("You cannot warn a bot account.");
				} else call.safeSend("Please supply a valid user tag, mention, or id.");
			} else call.safeSend("Please supply a valid user tag, mention, or id.");
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
};
