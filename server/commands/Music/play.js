module.exports = {
	id: "play",
	description: "Plays music in a music channel.",
	paramsHelp: "(query)",
	botRequires: ["CONNECT", "SPEAK"],
	botRequiresMessage: "To play music.",
	access: "Server",
	execute: (call) => {
		var query = call.params.readParam(true);
		if (query != null) {
			call.client.music.play(query, call);
		} else {
			call.message.channel.send("Please enter a query (url or term) to try and play.");
		}
	}
};
