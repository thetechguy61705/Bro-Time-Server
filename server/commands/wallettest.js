module.exports = {
	id: "wallettest",
	execute: (call) => {
		var param = call.params.readParameter();
		if (param != null) {
			call.getWallet(call.message.author.id).getTotal().then((total) => {
				call.message.channel.send(total.toString());
			});
		} else {
			call.getWallet(call.message.author.id).change(1).then(() => {
				call.getWallet(call.message.author.id).getTotal().then((newTotal) => {
					call.message.channel.send(newTotal.toString());
				});
			});
		}
	}
};
