var yargs = require("yargs");

yargs.command(require("./cliCommands/default"))
	.help().argv;
