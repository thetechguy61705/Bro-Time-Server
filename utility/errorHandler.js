function output(error) {
	console.warn(error.stack);
}

process.on("unhandledRejection", (reason) => {
	if (reason instanceof Error)
		output(reason);
});

process.on("warning", (warning) => {
	output(new Error(warning));
});

module.exports = function handle(object) {
	object.on("error", output);
};
