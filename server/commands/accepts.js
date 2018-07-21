module.exports = {
	id: "accepts",
	test: true,
	exec: (call) => {
		call.requestInput(null, "Enter a number...", 180000, /^[0-9]+$/).then(() => {
			call.message.channel.send("Number entered.");
		}).catch(() => {
			call.message.channel.send("Input request cancelled.");
		});
	}
};