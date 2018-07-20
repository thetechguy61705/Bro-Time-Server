module.exports = {
	id: "skip",
	aliases: ["next"],
	description: "Skips a playing song.",
	access: "Server",
	exec: (call) => {
		call.client.music.skip(call);
	}
};
