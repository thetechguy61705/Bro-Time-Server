module.exports = {
	id: "wallettest",
	execute: (call) => {
		call.getWallet(call.message.author.id).getTotal().then((total) => {
			call.message.channel.send(total.toString());
		});
	}
};
