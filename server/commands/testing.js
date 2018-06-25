module.exports = {
	id: "test",
	execute: (call) => {
		call.safeSend("hello");
	}
};
