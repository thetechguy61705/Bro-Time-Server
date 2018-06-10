const Discord = require("discord.js");
const fs = require("fs");
const Moderator = require("app/moderator");
var actions = new Discord.Collection();

fs.readdirSync(__dirname + "/../../actions/role").forEach((file) => {
	try {
		const ACTION = require("../../actions/role/" + file);
		actions.set(ACTION.id, ACTION);
	} catch(err) {
		console.log("Role action failed to load:");
		console.warn(err.stack);
	}
});

module.exports = {
	id: "role",
	description: "Gives the user the specified role(s) if the role is below the author's highest role.",
	paramsHelp: "(user/option) [role/roles]",
	requires: "Moderator permissions",
	execute: (call) => {
		if (Moderator(call.message.member)) {
			const PARAMETER = (call.params.readParameter() || "").toLowerCase(),
				ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
			(ACTION || actions.get("default")).run(call, actions, PARAMETER).catch((err) => {
				console.log("Role action failed:");
				console.warn(err.stack);
			});
		} else {
			call.message.reply("You do not have permission to use this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
