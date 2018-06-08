const Moderator = require("app/moderator");

module.exports = {
	id: "modtest",
	execute: (call) => {
		call.message.channel.send(Moderator(call.message.member).toString());
	}
};
