module.exports = {
	id: "customcolor",
	test: true,
	description: "Allows the user to create their own role, with a custom name and color.",
	requires: "Bro Time Premium",
	arguments: "... prompt",
	execute: async (call) => {
		call.message.reply("soon™");
	}
};
