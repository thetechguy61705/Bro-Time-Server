import { Source } from "@server/load/music";

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
			try {
				ytdl.getInfo(query, this, (err, info) => {
					if (err == null) {
						miniget(`https://www.googleapis.com/youtube/v3/videos?id=${info.video_id}&part=contentDetails&key=${key}`, (err, _res, body) => {
							if (err) {
								throw err;
							} else {
								var rating = JSON.parse(body).items[0].contentDetails.contentRating;
								info.mature = rating != null && rating.ytRating === "ytAgeRestricted";
								resolve(info);
							}
						});
					} else {
						throw err;
					}
				});
			} catch (err) {
				resolve(null);
				if (!err.message.startsWith("No video id found"))
					console.warn(err.stack);
			}
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
		var stream = ytdl.downloadFromInfo(ticket, this);
		Object.defineProperty(stream, "title", { value: ticket.title });
		Object.defineProperty(stream, "author", { value: ticket.author.name });
		return stream;
	},

	search(query, key) {
		return new Promise((resolve) => {
			miniget(`https://www.googleapis.com/youtube/v3/search?type=video&q=${querystring.escape(query)}&maxResults=5&part=id,snippet&key=${key}`, (err, _res, body) => {
				if (err != null) {
					console.warn(err.stack);
					resolve([]);
				} else {
					resolve(JSON.parse(body).items.map((item) => {
						return {
							display: item.snippet.title,
							query: item.id.videoId
						};
					}));
				}
			});
		});
	}
} as Source;
