module.exports = {
	id: "test",
	test: true,
	load: () => {},
	execute: (call) => {
		call.message.reply("the test command was executed.");
	}
};
