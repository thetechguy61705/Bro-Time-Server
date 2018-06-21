module.exports = {
	id: "default",
	run: (call, actions) => {
		call.requestInput(0, "Invalid option. Please re-specify. Options are: `" + actions.keyArray().join("`, `") + "`. Respond `cancel` to cancel.", 60000).then((newCall) => {
			if (newCall.message.content.toLowerCase() !== "cancel") {
				var actionToRun = actions.find((action) => (action.aliases || []).concat([action.id]).includes(newCall.message.content.toLowerCase()));
				if (actionToRun != null) {
					actionToRun.run(call, actions);
				} else {
					module.exports.run(call, actions);
				}
			} else call.safeSend("Cancelled prompt.");
		});
	}
};
