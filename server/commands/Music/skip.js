module.exports = {
	id: "skip",
	description: "Skips a playing song.",
	access: "Server",
	execute: (call) => {
		call.client.music.skip(call);
	}
};
