module.exports = {
	id: "commandstest",
	load: () => {},
	execute: (call) => {
		console.log(call.commands);
	}
};
