const Discord = require("discord.js");
const fs = require("fs");
const MOD_ROLES = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
var actions = new Discord.Collection();

fs.readdirSync(__dirname + "/../../actions/role").forEach((file) => {
	try {
		const ACTION = require("../../actions/role/" + file);
		actions.set(action.id, action);
	} catch(err) {
		console.log(err);
	}

});

module.exports = {
	id: "role",
	description: "Gives the user the specified role(s) if the role is below the author's highest role.",
	arguments: "(user/option) [role/roles]",
	requires: "Moderator permissions",
	execute: (call) => {
		if (call.message.member.roles.some((role) => MOD_ROLES.includes(role.id))) {
			const parameter = (call.params.readParameter() || ""), 
				ACTION = actions.find((a) => a.id === parameter.toLowerCase() || (a.aliases || []).includes(parameter));
			(action || actions.get("default")).run(call, actions, parameter).catch((err) => {
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
