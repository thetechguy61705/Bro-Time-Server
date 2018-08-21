module.exports = {
	id: "stop",
	description: "Stops playing music.",
	access: "Server",
	exec: (call) => call.client.music.stop(call)
};
