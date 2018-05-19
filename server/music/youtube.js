var ytdl = require("ytdl-core");
var miniget = require("miniget");
var querystring = require("querystring");

const MIN_RATING = 3;

module.exports = {
	id: "youtube",
	filter: "audio",
	retires: 0,

	getTicket(query, key) {
		return new Promise((resolve) => {
			ytdl.getInfo(query, this, (err, info) => {
				if (err == null) {
					miniget(`https://www.googleapis.com/youtube/v3/videos?id=${info.video_id}&part=contentDetails&key=${key}`, (err, res, body) => {
						if (err) {
							console.warn(err.stack);
							resolve(null);
						} else {
							var rating = JSON.parse(body).items[0].contentDetails.contentRating;
							info.mature = rating != null && rating.ytRating === "ytAgeRestricted";
							resolve(info);
						}
					});
				} else {
					console.warn(err.stack);
					resolve(null);
				}
			});
		});
	},

	getPlayable(ticket) {
		var play = "good";
		if (ticket.mature) {
			play = "mature";
		} else if (ticket.allow_ratings !== "1" || parseFloat(ticket.avg_rating) < MIN_RATING) {
			play = "unknown";
		}
		return play;
	},

	load(ticket) {
		return ytdl.downloadFromInfo(ticket, this);
	},

	search(query, key) {
		return new Promise((resolve) => {
			miniget(`https://www.googleapis.com/youtube/v3/search?type=video&q=${querystring.escape(query)}&maxResults=5&part=id&key=${key}`, (err, res, body) => {
				if (err == null) {
					resolve(JSON.parse(body).items.map((item) => { return item.id.videoId; }));
				} else {
					resolve([]);
				}
			});
		});
	}
};
