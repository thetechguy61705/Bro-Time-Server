const Discord = require("discord.js");
const load = require("@utility/filesloader").default;
var actions = new Discord.Collection();

load("actions/info", {
	success: (action) => {
		actions.set(action.id, action);
	},
	failureMessage: "Error loading info action."
});

module.exports = {
	id: "info",
	aliases: ["information"],
	description: "Returns information on the specified topic, if the topic is gameroles, ad, donate, namecolors, levelroles or howtogetrole.",
	paramsHelp: "(option)",
	access: "Public",
	botRequires: ["ADD_REACTIONS"],
	botRequiresMessage: "To have information scrolling.",
	exec: (call) => {
		const PARAMETER = (call.params.readParam() || "").toLowerCase(),
			ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
		try {
			(ACTION || actions.get("default")).run(call, actions, PARAMETER);
		} catch (exc) {
			console.warn("Info action failed:");
			console.warn(exc.stack);
		}
	}
};
