const { RichEmbed } = require("discord.js");
const math = require("mathjs");

module.exports = {
	id: "calculator",
	aliases: ["math", "calc", "c"],
	description: "Allows you to run math equations",
	paramsHelp: "(expression)",
	exec: async (call) => {
		var expression = call.params.readParam(true);
		var mathEmbed = new RichEmbed();
		if (expression) {
			try {
				var result = math.eval(expression);
				if (Array.isArray(result.entries)) result = result.entries[result.entries.length - 1];
				mathEmbed
					.setTitle("Success")
					.setDescription(`Result:\n\`\`\`js\n${result}${" ".repeat(3)}\`\`\``)
					.setColor("GREEN");
			} catch (exc) {
				mathEmbed
					.setTitle("Error")
					.setDescription(`Error while parsing expression supplied: \`${exc.message.replace(/`/g, "")}\`.`)
					.setColor("RED");
			}
			call.safeSend(null, call.message, { embed: mathEmbed });
		} else call.safeSend("You must supply an expression.");
	}
};
