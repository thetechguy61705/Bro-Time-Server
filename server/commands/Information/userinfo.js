const { RichEmbed, GuildMember } = require("discord.js");

module.exports = {
	id: "userinfo",
	aliases: ["userinformation", "infouser", "whois"],
	description: "Displays information on the specified user.",
	paramsHelp: "(user tag in guild or user id anywhere)",
	access: "Server",
	execute: async (call) => {
		var param = (call.params.readParam(true) || "").toLowerCase();
		var user;
		try {
			if (call.message.channel.type === "text") {
				var guild = await call.message.guild.fetchMembers("", call.message.guild.memberCount);
				user = guild.members.find((member) => param.includes(member.id) || member.user.tag.toLowerCase().startsWith(param || null)) ||
					await call.client.fetchUser(param || "nothing");
			} else {
				user = await call.client.fetchUser(param || "nothing");
			}
		} catch (exc) {
			console.warn(exc.stack);
		}
		if (user instanceof GuildMember) user = user.user;
		if (user != null) {
			var infoEmbed = new RichEmbed()
				.setTitle("Information on " + user.username)
				.setColor(0x00AE86)
				.addField("Username", user.username, true)
				.addField("Discriminator", user.discriminator.toString(), true)
				.addField("Mention", user.toString(), true)
				.addField("ID", user.id, true)
				.addField("Displayed Avatar", `[URL](${user.displayAvatarURL})`, true)
				.addField("Default Avatar", `[URL](${user.defaultAvatarURL})`, true)
				.addField("Registered At", user.createdAt.toString().substring(0, 15), true)
				.addField("Automation", user.bot, true)
				.addField("Status", user.presence.status === "dnd" ? "do not disturb" : user.presence.status, true);
			infoEmbed.setDefaultFooter(call.message.author);
			call.safeSend(null, call.message, { embed: infoEmbed });
		} else call.safeSend("You did not specify a valid user.");
	}
};
