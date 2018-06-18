module.exports = {
	id: "toggle",
	description: "Toggles the music.",
	execute: (call) => {
		call.client.music.toggle(call);
	}
};
