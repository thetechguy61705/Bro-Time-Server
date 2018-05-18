var ytdl = require("ytdl-core");

const MIN_RATING = 2;

module.exports = {
	filter: "audio",
	retires: 0,
	// Cloudflare Proxy
	requestOptions: {
		transform: (parsed) => {
			return {
				host: "1.1.1.1",
				port: 8888,
				path: "/" + parsed.href,
				headers: { Host: parsed.host }
			};
		}
	},

	getTicket(query) {
		return new Promise((resolve) => {
			ytdl.getInfo(query, this, (err, info) => {
				resolve(err == null ? info : null);
			});
		});
	},

	getPlayable(ticket) {
		// start good
		// Check the rating. mature
		// Known issue? bad
		var play = "good";
		if (ticket.allow_ratings !== "1" || parseFloat(ticket.avg_rating) < MIN_RATING) {
			play = "unknown";
		}
		return play;
	},

	relay() {

	},

	pause() {

	},

	continue() {

	},

	search() {

	}
};
