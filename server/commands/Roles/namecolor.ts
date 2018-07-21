import { IRoleCommand, RoleCommand } from "@utility/rolecommand";

const ROLES = [
	"BLACK",
	"RED",
	"BRIGHTRED",
	"ORANGE",
	"BRONZE",
	"GOLD",
	"HOTBROWN",
	"SALMON",
	"YELLOW",
	"GREEN",
	"DARKGREEN",
	"LIMEGREEN",
	"LIGHTGREEN",
	"BLUE",
	"GRAYBLUE",
	"CYAN",
	"PURPLE",
	"INDIGO",
	"DARKVIOLET",
	"MAGENTA",
	"HOTPINK",
	"PINK",
	"INVISIBLE",
	"MULTICOLORED"
];

module.exports = new RoleCommand({
	id: "namecolor",
	roles: ROLES,
	reference: "color role",
	allowGive: true,
	allowTake: false,
	allowMultiple: false,
	response: "Invalid color role. A list of color roles can be found in `!info namecolors list`.",
	aliases: ["color"],
	description: "Gives the user the specified role if it is a part of !info namecolors list.",
	paramsHelp: "(color role)",
	requires: "Nothing/Bro Time Premium"
} as IRoleCommand);
