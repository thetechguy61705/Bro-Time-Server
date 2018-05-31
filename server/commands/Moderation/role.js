const Discord = require("discord.js");
const fs = require("fs");
var actions = new Discord.Collection();

fs.readdirSync(__dirname + "/../../role-actions").forEach((file) => {
	try {
		const action = require("../../role-actions/" + file);
		actions.set(file.substring(0, file.length - 3), action);
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
		const modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
		if (call.message.member.roles.some((role) => modRoles.includes(role.id))) {
			const parameter = call.params.readParameter(), action = actions.get(parameter);
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
