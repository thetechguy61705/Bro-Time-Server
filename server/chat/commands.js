var modules = {};
var Parameters = require("./utility/paramaters");
var util = require("util");
var prefixPattern = "^(<@%d>|%s)";

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

		modules[module.id] = module;
	}, exc => {
		console.warn("A command failed to load: %s (reason: %s)", name, exc);
	});
});

module.exports = {
	exec: function(message, client) {
		var prefix = message.content.match(new RegExp(util.format(prefixPattern,
			client.user.id,
			message.data.prefix), "i"));
		if (prefix !== null) {
			var params = new Parameters(message);
			params.Offset(prefix[0].length);
			// params.ReadParameter(); - command name
			// params.ReadSeparator();
			// Check restrictions.
			// Call the command.
		}
	}
};
