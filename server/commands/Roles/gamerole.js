const GAMES = ["Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
	"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
	"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
	"Call of Duty", "Destiny", "Psych", "Bro Time Games"];

module.exports = {
	id: "gamerole",
	description: "Gives the user the specified role if it is a part of !info gameroles list.",
	paramsHelp: "(game role)",
	access: "Server",
	botRequires: ["MANAGE_ROLES"],
	botRequiresMessage: "To give gameroles.",
	execute: (call) => {
		var game = call.params.readRole();
		if (game != null && GAMES.includes(game.name)) {
			if (call.message.member.roles.has(game.id)) {
				call.message.member.removeRole(game).then(() => {
					call.message.reply(`Since you already had the \`${game.name}\` game role, it has been removed from you.`).catch(() => {
						call.message.author.send(`Since you already had the \`${game.name}\` gamerole, it has been removed from you.`);
					});
				}).catch(() => {
					call.message.reply(`Unable to remove the \`${game.name}\` game role.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${game.name}\` game role from you.`);
					});
				});
			} else {
				call.message.member.addRole(game).then(() => {
					call.message.reply(`Successfully given you the \`${game.name}\` game role.`).catch(() => {
						call.message.author.send(`Successfully given you the \`${game.name}\` game role.`);
					});
				}).catch(() => {
					call.message.reply(`Unable to give you the \`${game.name}\` game role.`).catch(() => {
						call.message.author.send(`Unable to give you the \`${game.name}\` game role.`);
					});
				});
			}
		} else call.safeSend("Invalid game option. Game options can be found in `!info gameroles list`.");
	}
};
