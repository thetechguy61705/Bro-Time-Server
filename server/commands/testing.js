module.exports = {
	id: "test",
	test: true,
	exec: (call) => { call.safeSend("Recieved your test."); }
};
