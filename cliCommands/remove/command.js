var prompts = require("../prompts");

exports.command = "command <id>";

exports.describe = "Removes a command entirely (globally and from all servers).";

exports.handler = () => {
	prompts.irreversiblePrompt.run().then((answer) => {
		// remove command
		console.log(answer);
	});
};
