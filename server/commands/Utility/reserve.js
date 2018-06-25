const Discord = require("discord.js");
const fs = require("fs");
var actions = new Discord.Collection();

for (let file of fs.readdirSync(__dirname + "/../../actions/reserve")) {
	try {
		const ACTION = require("../../actions/reserve/" + file);
		actions.set(ACTION.id, ACTION);
	} catch (err) {
		console.warn("Error loading reserve action " + file + ":");
		console.warn(err.stack);
	}
}

module.exports = {
	id: "reserve",
	description: "Creates private gaming channel.",
	paramsHelp: "(option) [@user]",
	reservedChannels: new Discord.Collection(),
	execute: (call) => {
		const PARAMETER = (call.params.readParameter() || "").toLowerCase(),
			ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
		try {
			ACTION.run(call, actions, PARAMETER);
		} catch (exc) {
			console.warn("Reserve action failed:");
			console.warn(exc.stack);
		}
	}
};
