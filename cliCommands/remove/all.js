var prompts = require("../prompts");

exports.command = "all";

exports.describe = "Removes the database objects.";

exports.handler = () => {
	prompts.irreversiblePrompt.run().then((answer) => {
		// remove all
		console.log(answer);
	});
};
