var yargs = require("yargs");

exports.command = "*";

exports.describe = "Performs maintenance tasks on the current machine.";

exports.handler = () => yargs.showHelp();

exports.builder = (instance) => {
	instance.subCommand = (name, desc) => {
		return instance.command(name, desc, (subInstance) => {
			return subInstance.commandDir(name);
		}, () => instance.showHelp());
	};

	return instance.subCommand("add", "Adds components.")
		.subCommand("remove", "Removes components.")
		.subCommand("debug", "Debugs components.");
};
