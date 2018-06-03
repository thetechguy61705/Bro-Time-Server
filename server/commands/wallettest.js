module.exports = {
	id: "wallettest",
	exec: (call) => {
		call.getWallet(id).getTotal().then((total) => {
			message.channel.send(total.toString());
		});
	}
};
