import { IRoleCommand, RoleCommand } from "@utility/rolecommand";

module.exports = new RoleCommand({
	id: "freerole",
	roles: ["ANN", "GW", "QOTD", "MOVIES"],
	allowGive: true,
	allowTake: true,
	allowMultiple: true,
	reference: "free role",
	description: "Gives the user the specified role if it is QOTD, ANN or GW.",
	paramsHelp: "(ANN/GW/QoTD/Movies)"
} as IRoleCommand);
