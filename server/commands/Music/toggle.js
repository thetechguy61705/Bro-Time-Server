module.exports = {
	id: "toggle",
	aliases: ["pause"],
	description: "Toggles the music.",
	access: "Server",
	exec: (call) => call.client.music.toggle(call)
};
