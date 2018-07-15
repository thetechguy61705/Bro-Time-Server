const { RichEmbed } = require("discord.js");

function clean(text, token) {
	if (typeof(text) === "string") {
		return text.replace(/`/g, "`" + String.fromCharCode(8203))
			.replace(/@/g, "@" + String.fromCharCode(8203))
			.replace(new RegExp(token, "gi"), "[ HIDDEN ]");
	} else {
		return text;
	}
}

module.exports = {
	id: "eval",
	execute: async (call) => {
		if (call.message.author.id === "432650511825633317") {
			try {
				/* eslint-disable no-unused-vars */
				const bot = call.client,
					client = call.client,
					message = call.message,
					code = call.params.readRaw();
				/* eslint-enable no-unused-vars */
				var token = call.client.token;
				var currentTime = Date.now();
				var evaled = await eval(code);
				if (typeof evaled !== "string")
					evaled = require("util").inspect(evaled);
				call.safeSend(null, call.message, { embed:
					new RichEmbed()
						.setTitle("Evaled")
						.setDescription(`\`\`\`js\n${clean(evaled, token).substring(0, 500)}${" ".repeat(2)}\`\`\``)
						.setFooter(`Took ${Date.now() - currentTime} milliseconds.`)
						.setColor("GREEN")
				});
			} catch (err) {
				call.safeSend(null, call.message, { embed:
					new RichEmbed()
						.setTitle("Error")
						.setDescription(`\`\`\`x1\n${clean(err, token)}\`\`\``)
						.setFooter(`Took ${Date.now() - currentTime} milliseconds.`)
						.setColor("RED")
				});
			}
		}
	}
};
