import { ICommand, Call } from "@server/chat/commands";
import { DataRequest, PREFIX_DEFAULT } from "@utility/datarequest.ts";
const isModerator = require("@utility/moderator");

module.exports = {
	id: "prefix",
	description: "Changes the guild's prefix.",
	paramsHelp: "(option) [new prefix]",
	access: "Server",
	execute: (call: Call) => {
		if (isModerator(call.message.author)) {
			var data = (call.message.guild || call.message.channel).data;
			var option = call.params.readParam();
			switch (option) {
			case "set":
				var newPrefix = call.params.readParam(true);
				if (newPrefix && newPrefix.length <= 5) {
					data.setPrefix(newPrefix).then(() => {
						call.message.channel.send(`Set the prefix for this server to \`${newPrefix}\`.`);
					}, (exc: Error) => {
						call.safeSend("Failed to set the prefix.");
						console.warn("Unable to set prefix:");
						console.warn(exc.stack);
					});
				} else call.safeSend("Invalid prefix. The prefix must be at least one character and at most five.");
				break;
			case "reset":
				data.setPrefix(PREFIX_DEFAULT).then(() => {
					call.message.channel.send(`Reset the prefix for this server to \`${PREFIX_DEFAULT}\`.`);
				}, (exc: Error) => {
					call.safeSend("Failed to set the prefix.");
					console.warn("Unable to set prefix:");
					console.warn(exc.stack);
				});
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
		} else call.safeSend("You do not have permissions to trigger this command.");
	}
} as ICommand;
