var util;

module.exports = {
	id: "multistep",
	test: true,
	load: () => {
		util = require("util");
	},
	execute: (call) => {
		var settings = 0;
		var cancel = false;
		var param = null;

		do {
			param = call.params.ReadWord();
			if (param == "cancel") {
				cancel = true;
				param = null;
			} else if (param !== null && typeof call.commands[param] === "number")
				settings = settings|call.commands[param];
		} while (param !== null);

		if (cancel) {
			call.denyInput();
		} else {
			call.requestInput(settings).then((input) => {
				call.message.channel.send(`\`\`\`
				                            ${util.inspect(input)}
				                            \`\`\``);
			}).catch(() => {
				call.message.channel.send("Input request cancelled.");
			});
		}
	}
};
