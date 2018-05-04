module.exports = {
	id: "ping",
	description: "Returns the response time of the bot in milliseconds, as well as a diagnostic.",
	load: () => {},
	execute: (call) => {
		var delay = Math.round(call.client.ping);
		var diag;
		if (delay <= 0) {
			diag = "impossible";
		} else if (delay < 200) {
			diag = "great";
		} else if (delay < 350) {
			diag = "good";
		} else if (delay < 500) {
			diag = "ok";
		} else if (delay < 750) {
			diag = "bad";
		} else if (delay < 1000) {
			diag = "terrible";
		} else {
			diag = "worse than dial up";
		}
		call.message.channel.send(`Pong, \`${delay}ms; ${diag}\`!`).catch(() => {
			call.message.author.send(`You attempted to run the \`ping\` command in ${call.message.channel}, but I do not have permission to chat there.`)
				.catch(function(){});
		});
	}
};
