const { Message } = require("discord.js");
const isModerator = require("app/moderator");
const INVITE_REGEX = /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/\w+/gi;
const MARKDOWN = /(`|\*|_|~)+/g;

module.exports = {
	INVITE_REGEX: INVITE_REGEX,

	load: function(client) {
		client.on("messageUpdate", this.exec);
	},
	exec: async function(message, newMessage) {
		const GUILDS = require("../server").guilds;
		console.log(GUILDS)

		if (newMessage instanceof Message)
			message = newMessage;

		if (message.deletable && message.channel.type === "text" && message.author.id !== message.client.user.id) {
			var invites = message.content.replace(MARKDOWN, "").match(INVITE_REGEX);
			var warned = false;

			if (invites != null) {
				for (let possibleInvite of invites) {
					try {
						var invite = await message.client.fetchInvite(possibleInvite);
						if (invite != null && invite.guild.id !== message.guild.id && !isModerator(message.member) && !warned) {
							if (GUILDS.includes(message.guild.id)) {
								if (!GUILDS.includes(invite.guild.id)) {
									warned = true;
									message.reply("Please do not send invites to other Discord servers.").then((msg) => {
										msg.delete(3000);
									});
									message.delete();
								}
							} else {
								warned = true;
								message.reply("Please do not send invites to other Discord servers.").then((msg) => {
									msg.delete(3000);
								});
								message.delete();
							}
						}
					} catch (exc) {
						if (!exc.message.startsWith("Unknown Invite") && !exc.message.startsWith("404: Not Found"))
							console.warn(exc.stack);
					}
				}
			}
		}
	}
};
