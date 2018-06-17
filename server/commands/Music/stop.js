module.exports = {
	id: "stop",
	description: "Stops playing music.",
	execute: (call) => {
		call.client.music.stop(call);
	}
};
