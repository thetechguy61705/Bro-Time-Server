module.exports = {
	id: "fetchtest",
	execute: (call) => {
		call.client.channels.get("447205162436788235").fetchMessage("447958383144730625").then(msg => {
      console.log(msg);
    });
	}
};
