module.exports = {
	id: "test",
	test: true,
	execute: (call) => { call.safeSend("Recieved your test."); }
};
