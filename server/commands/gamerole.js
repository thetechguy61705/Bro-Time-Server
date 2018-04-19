var games = ["`Roblox`", "`Minecraft`", "`Cuphead`", "`Fortnite`", "`Undertale`", "`Unturned`", "`VRChat`",
	     "`PUBG`", "`FNAF`", "`Clash of Clans`", "`Clash Royale`", "`Sims`", "`Terraria`", "`Subnautica`", "`Rocket League`",
	     "`Portal`", "`Hat in Time`", "`CSGO`", "`Splatoon`", "`Mario`", "`Starbound`", "`Garry's Mod`", "`Overwatch`",
	     "`Call of Duty`", "`Destiny`", "`Psych`"
	    ];

module.exports = {
	id: "gamerole",
	load: () => {},
	execute: (call) => {
		var rawinput = call.params.readRaw();
		if (rawinput === "") return call.message.reply("You must specify a gamerole!").catch(() => {
			call.message.author.send(`You attempted to use the \`gamerole\` command in ${call.message.channel}, but I do not have permission to chat there.`)
				.catch(function(){});
		});
		var game = games.find(function(g) {
			return g.toLowerCase().startsWith(rawinput.toLowerCase());
		});
		if (game !== undefined) {
			var role = call.message.guild.roles.find("name", game);
			if (call.message.member.roles.has(role.id)) {
				call.message.member.removeRole(role).then(() => {
					call.message.channel.send(`Since you already had the \`${game}\` game role, it has been removed from you.`).catch(() => {
						call.message.author.send(`Since you already had the \`${game}\` gamerole, it has been removed from you.`).catch(function(){});
					});
				}).catch(() => {
					call.message.channel.send(`Unable to remove the \`${game}\` game role.`).catch(() => {
						call.message.author.send(`Unable to remove the \`${game}\` game role from you.`).catch(function(){});
					});
				});
			} else {
				call.message.member.addRole(role).then(() => {
					call.message.channel.send(`Successfully given you the \`${game}\` game role.`).catch(() => {
						call.message.author.send(`Successfully given you the \`${game}\` game role.`).catch(function(){});
					});
				}).catch(() => {
					call.message.channel.send(`Unable to give you the \`${game}\` game role.`).catch(() => {
						call.message.author.send(`Unable to give you the \`${game}\` game role.`).catch(function(){});
					});
				});
			}
		} else {
			call.message.channel.send("Invalid game option. Game options can be found in `!info gameroles list`.").catch(() => {
				call.message.author
					.send(`You attempted to use the \`gamerole\` command in ${call.message.channel}, but I do not have permission to chat there.`)
					.catch(function(){});
			});
		}
	}
};
