module.exports = {
	id: "djtest",
	load: () => {},
	execute: (call) => {
		call.message.reply(`${dj(call.message.member)}`);
	}
};
