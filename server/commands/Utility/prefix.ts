import { ICommand, Call } from "@server/chat/commands";
import { DataRequest, PREFIX_DEFAULT } from "@utility/datarequest.ts";
import { User, GuildMember } from "discord.js";
import * as isModerator from "@utility/moderator";

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
		var option: string | null = call.params.readParam();
		switch (option) {
			case "set":
				if (checkMod(call.message.author, call.safeSend)) {
					var newPrefix: string | null = call.params.readParam(true);
					if (newPrefix && newPrefix.length <= 32) {
						DataRequest.setPrefix(call.message.guild.id, newPrefix).then((prefix: string) => {
							call.message.channel.send(`Set the prefix for this server to \`${prefix}\`.`);
						}, (exc: Error) => {
							call.safeSend("Failed to set the prefix.");
							console.warn("Unable to set prefix:");
							console.warn(exc.stack);
						});
					} else call.safeSend("Invalid prefix. The prefix must be at least one character and at most 32.");
				}
				break;
			case "reset":
				if (checkMod(call.message.author, call.safeSend)) {
					DataRequest.setPrefix(call.message.guild.id, PREFIX_DEFAULT).then((prefix: string) => {
						call.message.channel.send(`Reset the prefix for this server to \`${prefix}\`.`);
					}, (exc: Error) => {
						call.safeSend("Failed to set the prefix.");
						console.warn("Unable to set prefix:");
						console.warn(exc.stack);
					});
				}
				break;
			default:
				DataRequest.getPrefix(call.message.guild.id).then((prefix: string) => {
					call.message.channel.send(`The current prefix for this server is \`${prefix}\`. To change the prefix run \`${prefix}prefix set (new prefix)\`.`);
				}, (exc: Error) => {
					call.safeSend("Failed to retrieve the prefix. Please try again.");
					console.warn("Failed to retrieve prefix:");
					console.warn(exc.stack);
				});
		}
	}
} as ICommand;
