const Discord = require("discord.js");
const fs = require("fs");
const MOD_ROLES = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
var actions = new Discord.Collection();

fs.readdirSync(__dirname + "/../../actions/role").forEach((file) => {
	try {
		const ACTION = require("../../actions/role/" + file);
		actions.set(ACTION.id, ACTION);
	} catch(err) {
		console.log(err);
	}
});

module.exports = {
	id: "role",
	description: "Gives the user the specified role(s) if the role is below the author's highest role.",
	arguments: "(user/option) [role/roles]",
	requires: "Moderator permissions",
	botRequires: "MANAGE_ROLES",
	botRequiresMessage: "To give roles.",
	userRequires: "MANAGE_ROLES",
	userRequiresMessage: "To give roles.",
	execute: (call) => {
		if (call.message.member.roles.some((role) => MOD_ROLES.includes(role.id))) {
			const PARAMETER = (call.params.readParameter() || "").toLowerCase(),
				ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
			(ACTION || actions.get("default")).run(call, actions, PARAMETER).catch((err) => {
				console.log("Role action failed:");
				console.log(err);
			});
		} else {
			call.message.reply("You do not have permission to use this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(function() {});
			});
		}
	}
};
