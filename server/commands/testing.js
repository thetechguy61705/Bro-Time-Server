module.exports = {
	id: "test",
	test: true,
	execute: (call) => {
		call.message.reply("the test command was executed.");
	}
};
