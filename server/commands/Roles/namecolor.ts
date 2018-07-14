import { IRoleCommand } from "@server/chat/commands.ts";

const COLOR_ROLES = [
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

module.exports = {
	id: "namecolor",
	roles: COLOR_ROLES,
	reference: "color role",
	allow: {
		give: true,
		take: false,
		multiple: false
	},
	response: "Invalid color role. A list of color roles can be found in `!info namecolors list`.",
	aliases: ["color"],
	description: "Gives the user the specified role if it is a part of !info namecolors list.",
	paramsHelp: "(color role)",
	requires: "Nothing/Bro Time Premium",
} as IRoleCommand;
