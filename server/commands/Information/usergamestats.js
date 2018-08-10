const { RichEmbed } = require("discord.js");
const SUPPORTED_GAMES = ["ROBLOX"];
const Roblox = require("@utility/roblox");

async function checkUser(game, input) {
	var user;
	try {
		switch (game) {
			case "ROBLOX":
				user = await Roblox.fetchUser(input);
				break;
		}
	} catch (exc) {
		console.warn(exc.stack);
	}
	return user;
}

module.exports = {
	id: "usergamestats",
	aliases: ["gamestats"],
	description: "Displays the statistics on the specified user in the specified game.",
	access: "Public",
	exec: async (call) => {
		var game = call.params.readParam();
		var user = call.params.readParam(true);
		if (SUPPORTED_GAMES.includes((game || "").toUpperCase())) {
			user = await checkUser(game.toUpperCase(), user);
			if (user) {
				var userStatsEmbed = new RichEmbed()
					.setColor(0x00AE86)
					.setDefaultFooter(call.message.author);
				switch (game.toUpperCase()) {
					case "ROBLOX":
						call.message.channel.startTyping();
						var profile = await user.getProfile();
						var avatar = await user.getAvatarURL();
						call.message.channel.stopTyping();
						userStatsEmbed.setTitle(`Information on ROBLOX user ${user.username}`)
							.setThumbnail(avatar)
							.addField("Username", user.username, true)
							.addField("User ID", user.id, true)
							.addField("Friend Count", profile.friendsCount, true)
							.addField("Followers Count", profile.followersCount, true)
							.addField("Following Count", profile.followingCount, true)
							.addField("Membership", profile.membership, true)
							.addField("Join Date", profile.joinDate, true)
							.addField("Age", profile.age, true)
							.addField("Blurb", profile.blurb || "None.", true)
							.addField("Description", profile.description || "None.", true);
						call.safeSend({ embed: userStatsEmbed });
				}
			} else call.safeSend("Invalid user.");
		} else call.safeSend(`Invalid game. Supported games: \`${SUPPORTED_GAMES.join("`, `")}\`.`);
	}
};
