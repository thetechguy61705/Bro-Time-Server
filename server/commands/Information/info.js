const Discord = require("discord.js");
const fs = require("fs");
var actions = new Discord.Collection();

fs.readdirSync(__dirname + "/../../actions/info").forEach((file) => {
	try {
		const ACTION = require("../../actions/info/" + file);
		actions.set(ACTION.id, ACTION);
	} catch(err) {
		console.log(err);
	}
});

module.exports = {
	id: "info",
	aliases: ["information"],
	description: "Returns information on the specified topic, if the topic is gameroles, ad, donate, namecolors, levelroles or howtogetrole.",
	paramsHelp: "(option)",
	execute: (call) => {
		const PARAMETER = (call.params.readParameter() || "").toLowerCase(),
			ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
		(ACTION || actions.get("default")).run(call, actions, PARAMETER);
	}
};
