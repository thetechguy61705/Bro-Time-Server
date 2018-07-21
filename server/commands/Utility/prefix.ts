import { ICommand, Call } from "@server/chat/commands";
import { DataRequest, PREFIX_DEFAULT } from "@utility/datarequest.ts";
import { User, GuildMember } from "discord.js";
const isModerator = require("@utility/moderator");

function checkMod(user: User | GuildMember, send: Function) {
	if (isModerator(user)) {
		return true;
	} else {
		send("You do not have permissions to trigger this command");
		return false;
	}
}

module.exports = {
	id: "prefix",
	description: "Changes the guild's prefix.",
	paramsHelp: "(option) [new prefix]",
	access: "Server",
	exec: (call: Call) => {
		var option = call.params.readParam();
		switch (option) {
		case "set":
			if (checkMod(call.message.author, call.safeSend)) {
				var newPrefix = call.params.readParam(true);
				if (newPrefix && newPrefix.length <= 5) {
					DataRequest.setPrefix(call.message.guild.id, newPrefix).then(() => {
						call.message.channel.send(`Set the prefix for this server to \`${newPrefix}\`.`);
					}, (exc: Error) => {
						call.safeSend("Failed to set the prefix.");
						console.warn("Unable to set prefix:");
						console.warn(exc.stack);
					});
				} else call.safeSend("Invalid prefix. The prefix must be at least one character and at most five.");
			}
			break;
		case "reset":
			if (checkMod(call.message.author, call.safeSend)) {
				DataRequest.setPrefix(call.message.guild.id, PREFIX_DEFAULT).then(() => {
					call.message.channel.send(`Reset the prefix for this server to \`${PREFIX_DEFAULT}\`.`);
				}, (exc: Error) => {
					call.safeSend("Failed to set the prefix.");
					console.warn("Unable to set prefix:");
					console.warn(exc.stack);
				});
			} else call.safeSend("You do not have permissions to trigger this command.");
			break;
		default:
			DataRequest.getPrefix(call.message.guild.id).then((prefix: String) => {
				call.message.channel.send(`The current prefix for this server is \`${prefix}\`. To change the prefix run \`${prefix}prefix set (new prefix)\`.`);
			}, (exc: Error) => {
				call.safeSend("Failed to retrieve the prefix. Please try again.");
				console.warn("Failed to retrieve prefix:");
				console.warn(exc.stack);
			});
		}
	}
} as ICommand;