module.exports = {
	id: "ping",
	aliases: ["pong"],
	description: "Returns the response time of the bot in milliseconds, as well as a diagnostic.",
	access: "Public",
	execute: (call) => {
		var delay = call.client.pings[0];
		call.message.channel.send(`Pong! Latency: \`pinging...\`. API latency: \`${delay} ms; ${delay.diagnostic()}.\`!`).then((msg) => {
			var latency = Math.abs(msg.createdTimestamp - call.message.createdTimestamp);
			latency += (latency === 0 ? 5 : 0);
			msg.edit(`Pong! Latency: \`${latency} ms; ${latency.diagnostic()}\`. API latency: \`${delay} ms; ${delay.diagnostic()}\`!`);
		}).catch(() => {
			call.message.author.send(`You attempted to run the \`ping\` command in ${call.message.channel}, but I do not have permission to chat there.`);
		});
	}
};
