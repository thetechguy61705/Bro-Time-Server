var ytdl = require("ytdl-core");

module.exports = {
	getTicket(query) {
		return new Promise((resolve) => {
			ytdl.getInfo(query, this, (err, info) => {
				resolve(err == null ? info : null);
			});
		});
	}

	getPlayable(ticket) {

	}

	relay(ticket, stream) {

	}

	pause() {

	}

	continue() {

	}

	search(query) {

	}
};
