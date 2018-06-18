const Discord = require("discord.js");
const fs = require("fs");
const isModerator = require("app/moderator");
var actions = new Discord.Collection();

for (let file of fs.readdirSync(__dirname + "/../../actions/purge")) {
	try {
		const ACTION = require("../../actions/purge/" + file);
		actions.set(ACTION.id, ACTION);
	} catch(err) {
		console.warn("Error loading purge action " + file + ":");
		console.warn(err.stack);
	}
}

module.exports = {
	id: "purge",
	description: "Deletes messages.",
	paramsHelp: "(amount/option) [amount]",
	requires: "Moderator permissions",
	execute: (call) => {
		call.purgeMessages = async function(amount, channel = this.message.channel, filter = () => true) {
			var messages = await channel.fetchMessages({ limit: 100 });
			messages = messages.filter(filter).first(amount);
			var deleted = await channel.bulkDelete(messages);
			return deleted.size;
		}

		if (isModerator(call.message.member)) {
			const PARAMETER = (call.params.readParameter() || "").toLowerCase(),
				ACTION = actions.find((a) => a.id === PARAMETER || (a.aliases || []).includes(PARAMETER));
			try {
				(ACTION || actions.get("default")).run(call, actions, PARAMETER);
			} catch(exc) {
				console.warn("Purge action failed:");
				console.warn(exc.stack);
			}
		} else {
			call.message.reply("You do not have permission to use this command.").catch(() => {
				call.message.author.send(`You attempted to use the \`purge\` command in ${call.message.channel}, but I can not chat there.`);
			});
		}
	}
};
