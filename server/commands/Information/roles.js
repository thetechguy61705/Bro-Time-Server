const { RichEmbed } = require("discord.js");
const EMOJI_ARRAY = ["◀", "▶"];

module.exports = {
	id: "roles",
	aliases: ["userroles"],
	description: "Displays the specified user's or the guild's roles.",
	paramsHelp: "[user]",
	access: "Server",
	execute: (call) => {
		var all = !call.params.readRaw();
		var member = call.params.readMember();
		if (member != null || all) {
			var rolesEmbed = new RichEmbed();
			var roles = (all ? call.message.guild : member).roles.array().sort((a, b) => b.position - a.position).map((role) => `${role} (${role.members.size})`);
			var title = all ? "This guild's roles." : member.user.tag + "'s roles.";
			if (roles.length <= 20) {
				rolesEmbed.setTitle(title)
					.setDescription(roles.join("\n"))
					.setColor(0x00AE86)
					.setDefaultFooter(call.message.author);
				call.safeSend(null, call.message, { embed: rolesEmbed });
			} else {
				var rolesLength = 0,
					currentPage = 1,
					totalPages = 20 - (roles.length % 20);
				if (totalPages === 20) {
					totalPages = roles.length / 20;
				} else {
					totalPages = (roles.length + (20 - (roles.length % 20)));
					totalPages /= 20;
				}
				var rolesToSend = roles.slice(rolesLength, rolesLength + 20);
				rolesEmbed.setTitle(title)
					.setDescription(roles.slice(rolesLength, rolesLength + 20))
					.setFooter(`Page ${currentPage}/${totalPages} -`)
					.setColor(0x00AE86)
					.setDefaultFooter(call.message.author);
				call.message.channel.send({ embed: rolesEmbed }).then(async (msg) => {
					await msg.reactMultiple(EMOJI_ARRAY);
					const FILTER = (reaction, user) => EMOJI_ARRAY.includes(reaction.emoji.name) && user.id === call.message.author.id;
					var reactions = msg.createReactionCollector(FILTER, { time: 120000 });

					reactions.on("collect", (reaction) => {
						reaction.remove(call.message.author);
						if (reaction.emoji.name === EMOJI_ARRAY[0] && currentPage > 1) {
							currentPage--;
							rolesLength -= 20;
							rolesToSend = roles.slice(rolesLength, rolesLength + 20);
						} else if (reaction.emoji.name === EMOJI_ARRAY[1] && currentPage < totalPages) {
							currentPage++;
							rolesLength += 20;
							rolesToSend = roles.slice(rolesLength, rolesLength + 20);
						}

						rolesEmbed = new RichEmbed()
							.setTitle(title)
							.setDescription(rolesToSend.join("\n"))
							.setColor(0x00AE86)
							.setFooter(`Page ${currentPage}/${totalPages} -`)
							.setDefaultFooter(call.message.author);
						msg.edit({ embed: rolesEmbed });
					});

					reactions.on("end", () => { msg.edit("Interactive command ended: 2 minutes passed."); });
				});
			}
		} else call.safeSend("You did not specify a valid user or no parameter to see roles in this guild.");
	}
};
