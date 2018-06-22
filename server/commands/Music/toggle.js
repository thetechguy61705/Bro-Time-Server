module.exports = {
	id: "toggle",
	description: "Toggles the music.",
	access: "Server",
	execute: (call) => {
		call.client.music.toggle(call);
	}
};
