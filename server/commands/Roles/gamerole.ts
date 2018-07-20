import { IRoleCommand, RoleCommand } from "@utility/rolecommand";

const ROLES = [
	"Roblox",
	"Minecraft",
	"Cuphead",
	"Fortnite",
	"Undertale",
	"Unturned",
	"VRChat",
	"PUBG",
	"FNAF",
	"Clash of Clans",
	"Clash Royale",
	"Sims",
	"Terraria",
	"Subnautica",
	"Rocket League",
	"Portal",
	"Hat in Time",
	"CSGO",
	"Splatoon",
	"Mario",
	"Starbound",
	"Garry's Mod",
	"Overwatch",
	"Call of Duty",
	"Destiny",
	"Psych",
	"Bro Time Games"
];

module.exports = new RoleCommand({
	id: "gamerole",
	roles: ROLES,
	allowGive: true,
	allowTake: true,
	allowMultiple: true,
	response: "Invalid game role. A list of game roles can be found in `!info gameroles list`.",
	reference: "game role",
	description: "Gives the user the specified role if it is a part of !info gameroles list.",
	paramsHelp: "(game role)"
} as IRoleCommand);
