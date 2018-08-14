const { RichEmbed } = require("discord.js");
const math = require("mathjs");

module.exports = {
	id: "calculator",
	aliases: ["math", "calc", "c"],
	description: "Allows you to run math equations",
	paramsHelp: "(expression)",
	params: [
		{
			type: "any",
			greedy: true,
			failure: "You must supply an expression.",
			required: true
		}
	],
	exec: async (call) => {
		var expression = call.parameters[0];
		var mathEmbed = new RichEmbed();
		try {
			var result = math.eval(expression);
			if (Array.isArray(result.entries)) result = result.entries[result.entries.length - 1];
			mathEmbed
				.setTitle("Success")
				.setDescription(`Result:\n\`\`\`js\n${result}${" ".repeat(3)}\`\`\``.substring(0, 2048))
				.setColor("GREEN");
		} catch (exc) {
			mathEmbed
				.setTitle("Error")
				.setDescription(`Error while parsing expression supplied: \`${exc.message.replace(/`/g, "")}\`.`)
				.setColor("RED");
		}
		call.safeSend({ embed: mathEmbed });
	}
};
