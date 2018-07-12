const Discord = require("discord.js");
const fs = require("fs");
var actions = new Discord.Collection();

for (let file of fs.readdirSync(__dirname + "/../../actions/info")) {
	try {
		const ACTION = require("@server/actions/info/" + file);
		actions.set(ACTION.id, ACTION);
	} catch (exc) {
		console.warn("Error loading info action " + file + ":");
		console.warn(exc.stack);
	}
}

module.exports = {
	id: "info",
	aliases: ["information"],
	description: "Returns information on the specified topic, if the topic is gameroles, ad, donate, namecolors, levelroles or howtogetrole.",
	paramsHelp: "(option)",
	access: "Public",
	botRequires: ["ADD_REACTIONS"],
	botRequiresMessage: "To have information scrolling.",
	execute: (call) => {
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
