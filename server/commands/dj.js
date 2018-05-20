module.exports = {
	id: "dj",
	// test: true,
	execute: (call) => {
		call.message.channel.send(call.client.music.isDj(call.message.member) ? "You are a DJ!" : "You are not a DJ.");
	}
};
