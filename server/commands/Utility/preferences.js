const fs = require("fs");
var actions = {};

for (let file of fs.readdirSync(__dirname + "/../../actions/configuration")) {
	if (!file.includes(".")) {
		actions[file] = {};
		for (let subFile of fs.readdirSync(__dirname + "/../../actions/configuration/" + file)) {
			var prop = require("../../actions/configuration/" + file + "/" + subFile);
			actions[file][prop.id] = prop;
		}
	}
}

module.exports = {
	id: "config",
	aliases: ["settings", "preferences", "prefs"],
	description: "Change Bro Bot's configuration for this server.",
	paramsHelp: "... prompt",
	access: "Server",
	execute: (call) => {
		var param = call.params.readParameter(), action = actions[(param || "").toLowerCase()];
		if (action != null) {
			call.requestInput(0, "Please specify a option for the `" + param + "` configuration category. Options: `" + Object.keys(action).join("`, `") + "`.").then((input) => {
				if (Object.keys(action).includes(input.message.content.toLowerCase())) {
					action[input.message.content.toLowerCase()].execute(call, actions, action, param);
				} else call.safeSend("You did not specify a valid option. Options: `" + Object.keys(action).join("`, `") + "`. Please re-run the command.");
			});
		} else call.safeSend("You did not specify a valid category. Categories: `" + Object.keys(actions).join("`, `") + "`. Please re-run the command.");
	}
};
