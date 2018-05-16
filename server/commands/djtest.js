const dj = require("app/dj");

module.exports = {
	id: "commandstest",
	load: () => {},
	execute: (call) => {
		console.log(call.commands);
	}
};
