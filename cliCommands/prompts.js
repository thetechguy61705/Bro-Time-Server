var Confirm = require("prompt-confirm");

// For irreversible actions, not the prompt itself.
exports.irreversiblePrompt = new Confirm("This action can not be undone. Are you sure you want to continue?");

exports.sqlImmutablePrompt = new Confirm("Some objects can not be modified, like enums, and tables. Would you like to proceed anyway?");
