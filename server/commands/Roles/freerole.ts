import { IRoleCommand } from "@server/chat/commands.ts";

module.exports = {
	id: "freerole",
	roles: ["ANN", "GW", "QOTD", "MOVIES"],
	allow: {
		give: true,
		take: true,
		multiple: true
	},
	reference: "free role",
	description: "Gives the user the specified role if it is QOTD, ANN or GW.",
	paramsHelp: "(ANN/GW/QoTD/Movies)"
} as IRoleCommand;
