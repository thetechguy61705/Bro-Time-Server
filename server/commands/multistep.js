var util = require("util");

function trim(output, max) {
	if (output.length > max)
		output = output.substring(0, max - 3).trimRight() + "...";
	return output;
}

module.exports = {
	id: "multistep",
	test: true,
	execute: (call) => {
		var settings = 0;
		var cancel = false;
		var param;

		do {
			param = call.params.readWord();
			if (param == "cancel") {
				cancel = true;
				param = null;
			} else if (param != null && typeof call.commands[param] === "number") {
				settings = settings|call.commands[param];
			}
		} while (param != null);

		if (cancel) {
			call.denyInput();
		} else {
			call.requestInput(settings, "Enter input...").then((input) => {
				call.message.channel.send(`\`\`\`\n${trim(util.inspect(input, {depth: 1}), 1992)}\n\`\`\``);
			}).catch(() => {
				call.message.channel.send("Input request cancelled.");
			});
		}
	}
};
