const GAMES = ["Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
	"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
	"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
	"Call of Duty", "Destiny", "Psych", "Bro Time Games"];

module.exports = {
	id: "gamerole",
	description: "Gives the user the specified role if it is a part of !info gameroles list.",
	paramsHelp: "(game role)",
	execute: (call) => {
		const GAME = call.params.readRole();
		if (GAME != null && GAMES.includes(GAME.name)) {
			if (call.message.member.roles.has(GAME.id)) {
				call.message.member.removeRole(GAME).then(() => {
					call.message.channel.send(`Since you already had the \`${GAME.name}\` game role, it has been removed from you.`).catch(() => {
						call.message.author.send(`Since you already had the \`${GAME.name}\` gamerole, it has been removed from you.`);
					});
				}).catch(() => {
					call.message.channel.send(`Unable to remove the \`${GAME.name}\` game role.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${GAME.name}\` game role from you.`);
					});
				});
			} else {
				call.message.member.addRole(GAME).then(() => {
					call.message.channel.send(`Successfully given you the \`${GAME.name}\` game role.`).catch(() => {
						call.message.author.send(`Successfully given you the \`${GAME.name}\` game role.`);
					});
				}).catch(() => {
					call.message.channel.send(`Unable to give you the \`${GAME.name}\` game role.`).catch(() => {
						call.message.author.send(`Unable to give you the \`${GAME.name}\` game role.`);
					});
				});
			}
		} else {
			call.message.channel.send("Invalid game option. Game options can be found in `!info gameroles list`.").catch(() => {
				call.message.author.send(`You attempted to use the \`gamerole\` command in ${call.message.channel}, but I do not have permission to chat there.`);
			});
		}
	}
};
