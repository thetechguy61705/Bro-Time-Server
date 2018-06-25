module.exports = {
	id: "stop",
	description: "Stops playing music.",
	access: "Server",
	execute: (call) => {
		call.client.music.stop(call);
	}
};
