module.exports = {
	id: "skip",
	description: "Skips a playing song.",
	execute: (call) => {
		call.client.music.skip(call);
	}
};
