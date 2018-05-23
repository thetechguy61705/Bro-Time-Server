module.exports = {
	id: "fetchtest",
	test: true,
	execute: (call) => {
		call.client.channels.get("447205162436788235").fetchMessage("447958383144730625").then(msg => {
			console.log(msg);
		});
		call.client.channels.get("447205162436788235").fetchMessages({ limit: 2 }).then(msg => {
			console.log(msg);
		});
	}
};
