module.exports = {
	id: "accepts",
	test: true,
	execute: (call) => {
		call.requestInput(0, "Enter a number...", 180000, /^[0-9]+$/).then(() => {
			call.message.channel.send("Number entered.");
		}).catch(() => {
			call.message.channel.send("Input request cancelled.");
		});
	}
};