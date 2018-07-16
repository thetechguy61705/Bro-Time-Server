module.exports = {
	id: "skip",
	aliases: ["next"],
	description: "Skips a playing song.",
	access: "Server",
	execute: (call) => {
		call.client.music.skip(call);
	}
};
