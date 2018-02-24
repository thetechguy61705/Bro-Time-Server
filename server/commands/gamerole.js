var games = ["roblox", "minecraft", "cuphead", "fortnite", "undertale", "unturned", "vrchat",
	"pubg", "fnaf", "clash of clans", "clash royale", "sims", "terraria", "subnautica", "rocket league",
	"portal", "hat in time", "csgo", "splatoon", "mario", "starbound", "garry's mod", "overwatch",
	"call of duty", "destiny"];
var ucfgames = ["roblox", "minecraft", "fortnite", "undertale", "unturned", "sims", "terraria",
	"subnautica", "portal", "splatoon", "mario", "starbound", "overwatch", "destiny"];
var wgames = ["vrchat", "clash of clans", "clash royale", "rocket league", "hat in time",
	"garry's mod", "call of duty"];
var acgames = ["pubg", "fnaf", "csgo"];

module.exports = {
	id: "gamerole",
	load: () => {},
	execute: (call) => {
		let game = call.params.readRaw().toLowerCase();
		if (game !== null) {
			if (games.includes(game)) {
				if (ucfgames.includes(game)) {
					var gamerole = game.charAt(0).toUpperCase() + game.slice(1);
				} else if (acgames.includes(game)) {
					var gamerole = call.params.readRaw().toUpperCase();
				} else if (wgames.includes(game)) {
					if (game == "vrchat") {
						var gamerole = "VRChat";
					} else if (game == "clash of clans") {
						var gamerole = "Clash of Clans";
					} else if (game == "clash royale") {
						var gamerole = "Clash Royale";
					} else if (game == "rocket league") {
						var gamerole = "Rocket League";
					} else if (game == "hat in time") {
						var gamerole = "Hat in Time";
					} else if (game == "garry's mod"||game == "garry’s mod"||game == "garrys mod") {
						var gamerole = "Garry's Mod";
					} else if (game == "call of duty") {
						var gamerole = "Call of Duty";
					}
				}
				if (call.message.member.roles.find("name", gamerole)) {
					call.message.member.removeRole(call.message.guild.roles.find("name", gamerole));
					call.message.channel
						.send(`Since you already had the \`${game}\` game role, it has been removed from you!`);
				} else {
					call.message.member.addRole(call.message.guild.roles.find("name", gamerole));
					call.message.channel.send(`Successfully given you the \`${game}\` game role!`);
				}
			} else {
				call.message.channel
					.send(`\`${game}\` is not a valid game option.`);
			}
		} else {
			call.message.channel.send("You didn't ask for any game role. \n Usage: `/gamerole (gamname)`");
		}
	}
};
