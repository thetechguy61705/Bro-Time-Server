const Discord = require("discord.js");
const Moderator = require("app/moderator");

module.exports = {
	id: "warn",
	description: "Sends the user a dm with the supplied reason.",
	paramsHelp: "(user) [reason]",
	requires: "Moderator permissions",
	execute: async (call) => {
		const rawContent = call.params.readRaw(),
			parameterOne = call.params.readParameter(),
			parameterTwo = call.params.readParameter();
		if (Moderator(call.message.member)) {
			const target = call.message.guild.members.find((member) => parameterOne.includes(member.user.id) || member.user.tag.toLowerCase().startsWith(parameterOne.toLowerCase()));
			if (parameterOne != null) {
				if (target != null) {
					if (!target.user.bot) {
						if (target.highestRole.position < call.message.member.highestRole.position) {
							var reason = (parameterTwo != null) ? "`" + rawContent.substr(parameterOne.length + 1) + "`" : "`No reason specified.`";
							try {
								await target.send(`You have been warned in the \`${call.message.guild.name}\` server by \`${call.message.author.tag}\` for ${reason}.`);
							} catch(err) {
								console.warn(err.stack);
							}

							call.message.channel.send(`***Successfully warned \`${target.user.tag}\`.***`).catch(() => {});
							var warnEmbed = new Discord.RichEmbed().setAuthor(target.user.tag, target.user.displayAvatarURL).setDescription(reason.substr(1).slice(0, -1))
								.setFooter(`Warned by ${call.message.author.tag} (${call.message.author.id})`)
								.setColor("ORANGE")
								.setTimestamp();
							call.client.channels.get("436353363786072104").send({embed: warnEmbed}).catch(() => {});
						} else {
							call.message.reply("Specified user is too high in this guild's hierarchy to be warned by you.").catch(() => {
								call.message.author.send(`You attempted to use the \`warn\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						}
					} else {
						call.message.reply("You cannot warn a bot account.").catch(() => {
							call.message.author.send(`You attempted to use the \`warn\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
						});
					}
				} else {
					call.message.reply("Please supply a valid user tag, mention, or id.").catch(() => {
						call.message.author.send(`You attempted to use the \`warn\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				}
			} else {
				call.message.reply("Please supply a valid user tag, mention, or id.").catch(() => {
					call.message.author.send(`You attempted to use the \`warn\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You do not have permissions to trigger this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`warn\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
