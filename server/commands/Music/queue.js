module.exports = {
	id: "queue",
	description: "Displays all queued songs.",
	access: "Server",
	exec: (call) => call.client.music.displayQueued(call)
};
