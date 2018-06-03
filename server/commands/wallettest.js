module.exports = {
	id: "wallettest",
	exec: (call) => {
		call.getWallet(call.message.author.id).getTotal().then((total) => {
			call.message.channel.send(total.toString());
		});
	}
};
