var modules = {};

var COMMANDS = ["ping"];

// TODO: Load commands.
COMMANDS.forEach(name => {
	new Promise((resolve, reject) => {
		try {
			resolve(require("../commands/" + name));
		} catch (exc) {
			reject(exc);
		}
	}).then(module => {
		// Verify the integrity of the module.
		// Load serializable data.
		// Call the load method.
		modules[module.id] = module;
	}, exc => {
		console.warn("A command failed to load: %s (reason: %s)", name, exc);
	});
});

module.exports = {
	exec() {
		// message, client
		// Search for the loaded command and run it.
		// Check permissions.
		// Run the command.
		// Save changes.
	};
};
