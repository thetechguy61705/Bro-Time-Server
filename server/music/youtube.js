var ytdl = require("ytdl-core");

const MIN_RATING = 3;

module.exports = {
	filter: "audio",
	retires: 0,

	getTicket(query) {
		return new Promise((resolve) => {
			ytdl.getInfo(query, this, (err, info) => {
				resolve(err == null ? info : null);
			});
		});
	},

	getPlayable(ticket) {
		var play = "good";
		// todo: Check mpaa (or similar) rating. Set to "mature" if applicable.
		if (ticket.allow_ratings !== "1" || parseFloat(ticket.avg_rating) < MIN_RATING) {
			play = "unknown";
		}
		return play;
	},

	load(ticket) {
		return ytdl.downloadFromInfo(ticket, this);
	},

	search() {

	}
};
