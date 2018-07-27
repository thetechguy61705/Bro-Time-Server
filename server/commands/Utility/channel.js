const Discord = require("discord.js");
const fs = require("fs");
const Moderator = require("@utility/moderator");
var actions = new Discord.Collection();

for (let file of fs.readdirSync(__dirname + "/../../actions/channel")) {
	try {
		const ACTION = require("@server/actions/channel/" + file);
		actions.set(ACTION.id, ACTION);
	} catch (err) {
		console.warn("Error loading channel action " + file + ":");
		console.warn(err.stack);
	}
}

module.exports = {
	id: "channel",
	description: "Manages channels in your Discord.",
	paramsHelp: "(option/channel)",
	requires: "Moderator permissions",
	botRequires: ["MANAGE_CHANNELS"],
	botRequiresMessage: "To create, delete and edit channels.",
	access: "Server",
	exec: async (call) => {
		if (Moderator(call.message.member)) {
			await call.message.guild.fetchMembers("", call.message.guild.memberCount);
			const PARAMETER = (call.params.readParam() || "").toLowerCase(),
				ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
			try {
				(ACTION || actions.get("default")).run(call, actions, PARAMETER);
			} catch (exc) {
				console.warn("Channel action failed:");
				console.warn(exc.stack);
			}
		} else call.safeSend("You do not have permission to use this command.");
	}
};
