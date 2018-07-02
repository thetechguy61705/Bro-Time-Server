module.exports = {
	id: "toggle",
	aliases: ["pause"],
	description: "Toggles the music.",
	access: "Server",
	execute: (call) => {
		call.client.music.toggle(call);
	}
};
