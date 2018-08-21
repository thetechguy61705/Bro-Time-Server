module.exports = {
	id: "repeat",
	description: "Repeats the queued songs.",
	paramsHelp: "[times]",
	access: "Server",
	exec: (call) => call.client.music.repeat(call, call.params.readNumber())
};
