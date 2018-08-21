function output(error) {
	console.warn(error.stack);
}

process.on("unhandledRejection", (reason) => {
	if (reason instanceof Error && !reason.message.includes("N-API"))
		output(reason);
});

process.on("warning", (warning) => {
	if (!warning.toString().includes("N-API")) output(new Error(warning));
});

module.exports = function handle(object) {
	object.on("error", output);
};
