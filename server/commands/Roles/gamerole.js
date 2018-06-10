const GAMES = ["Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
	"PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
	"Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
	"Call of Duty", "Destiny", "Psych", "Bro Time Games"];

module.exports = {
	id: "gamerole",
	description: "Gives the user the specified role if it is a part of !info gameroles list.",
	paramsHelp: "(game role)",
	execute: (call) => {
		var rawinput = call.params.readRaw();
		if (rawinput !== "") {
			const GAME = GAMES.find(function(g) {
				return g.toLowerCase().startsWith(rawinput.toLowerCase());
			});
			if (GAME != null) {
				const GAME_ROLE = call.message.guild.roles.find("name", GAME);
				if (call.message.member.roles.has(GAME_ROLE.id)) {
					call.message.member.removeRole(GAME_ROLE).then(() => {
						call.message.channel.send(`Since you already had the \`${GAME}\` game role, it has been removed from you.`).catch(() => {
							call.message.author.send(`Since you already had the \`${GAME}\` gamerole, it has been removed from you.`).catch(() => {});
						});
					}).catch(() => {
						call.message.channel.send(`Unable to remove the \`${GAME}\` game role.`).catch(() => {
							call.message.author.send(`Unable to remove the \`${GAME}\` game role from you.`).catch(() => {});
						});
					});
				} else {
					call.message.member.addRole(GAME_ROLE).then(() => {
						call.message.channel.send(`Successfully given you the \`${GAME}\` game role.`).catch(() => {
							call.message.author.send(`Successfully given you the \`${GAME}\` game role.`).catch(() => {});
						});
					}).catch(() => {
						call.message.channel.send(`Unable to give you the \`${GAME}\` game role.`).catch(() => {
							call.message.author.send(`Unable to give you the \`${GAME}\` game role.`).catch(() => {});
						});
					});
				}
			} else {
				call.message.channel.send("Invalid game option. Game options can be found in `!info gameroles list`.").catch(() => {
					call.message.author.send(`You attempted to use the \`gamerole\` command in ${call.message.channel}, but I do not have permission to chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("You must specify a gamerole!").catch(() => {
				call.message.author.send(`You attempted to use the \`gamerole\` command in ${call.message.channel}, but I do not have permission to chat there.`).catch(() => {});
			});
		}
	}
};
