module.exports = {
	id: "collect",
	aliases: ["pick", "grab", "take", "steal", "mine", "snatch", "pull", "select", "choose", "get"],
	execute: (call) => {
		call.message.delete(3000).catch(() => {});
	}
};