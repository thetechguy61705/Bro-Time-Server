import { Source } from "@server/load/music";
import fetch from "node-fetch";
const ytdl = require("ytdl-core");
const querystring = require("querystring");

const MIN_RATING = 3;

module.exports = {
	id: "youtube",
	filter: "audio",
	retires: 0,

	getTicket(query) {
		return new Promise((resolve) => {
			try {
				ytdl.getInfo(query, this, (err, info) => {
					if (err == null) {
						resolve(info);
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
		if (ticket.age_restricted) {
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
			fetch(`https://www.googleapis.com/youtube/v3/search?type=video&q=${querystring.escape(query)}&maxResults=5&part=id,snippet&key=${key}`).then(
				(err) => {
					console.warn(err.stack);
					resolve([]);
				}, (res) => {
					resolve(res.json().items.map((item) => {
						return {
							display: item.snippet.title,
							query: item.id.videoId
						};
					}));
				});
		});
	}
} as Source;
