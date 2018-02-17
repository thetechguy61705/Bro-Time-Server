var Confirm = require("prompt-confirm");

// For irreversible actions, not the prompt itself.
exports.irreversiblePrompt = new Confirm("This action can not be undone. Are you sure you want to continue?");
