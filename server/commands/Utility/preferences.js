const isModerator = require("@utility/moderator");
var fs = require("fs");
var actions = {};

for (let file of fs.readdirSync(__dirname + "/../../actions/configuration")) {
	if (!file.includes(".")) {
		actions[file] = {};
		for (let subFile of fs.readdirSync(__dirname + "/../../actions/configuration/" + file)) {
			var prop = require("@server/actions/configuration/" + file + "/" + subFile);
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
	exec: (call) => {
		if (isModerator(call.message.member)) {
			var param = call.params.readParam(), action = actions[(param || "").toLowerCase()];
			if (action != null) {
				call.requestInput(null, "Please specify a option for the `" + param + "` configuration category. Options: `" + Object.keys(action).join("`, `") + "`.").then((input) => {
					if (Object.keys(action).includes(input.message.content.toLowerCase())) {
						action[input.message.content.toLowerCase()].exec(call, actions, action, param);
					} else call.safeSend("You did not specify a valid option. Options: `" + Object.keys(action).join("`, `") + "`. Please re-run the command.");
				});
			} else call.safeSend("You did not specify a valid category. Categories: `" + Object.keys(actions).join("`, `") + "`. Please re-run the command.");
		} else call.safeSend("You do not have permissions to execute this command.");
	}
};
