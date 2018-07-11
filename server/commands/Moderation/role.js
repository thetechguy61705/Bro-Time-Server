const Discord = require("discord.js");
const fs = require("fs");
const Moderator = require("app/moderator");
var actions = new Discord.Collection();

for (let file of fs.readdirSync(__dirname + "/../../actions/role")) {
	try {
		const ACTION = require("../../actions/role/" + file);
		actions.set(ACTION.id, ACTION);
	} catch (err) {
		console.warn("Error loading role action " + file + ":");
		console.warn(err.stack);
	}
}

module.exports = {
	id: "role",
	description: "Gives the user the specified role(s) if the role is below the author's highest role.",
	paramsHelp: "(user/option) [role/roles]",
	requires: "Moderator permissions",
	botRequires: ["MANAGE_ROLES"],
	botRequiresMessage: "To delete/add roles to/from members.",
	access: "Server",
	execute: (call) => {
		if (Moderator(call.message.member)) {
			const PARAMETER = (call.params.readParam() || "").toLowerCase(),
				ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
			try {
				(ACTION || actions.get("default")).run(call, actions, PARAMETER);
			} catch (exc) {
				console.warn("Role action failed:");
				console.warn(exc.stack);
			}
		} else call.safeSend("You do not have permission to use this command.");
	}
};
