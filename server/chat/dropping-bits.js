const Premium = require("app/premium");
var { WalletAccess } = require("./../../data/server");
var { RichEmbed } = require("discord.js");

function getWallet(userId = null) {
	return new WalletAccess(userId);
}

module.exports = {
	TRIGGERS: ["pick", "grab", "take", "steal", "mine", "snatch", "pull", "select", "choose", "get"],
	WAIT_RATES: [120000, 180000, 90000, 30000, 150000, 90000, 120000, 300000, 180000, 200000],
	RATES: [7, 13, 13, 13, 13, 18, 22, 22, 25, 29],

	typingInHangout: 0,
	isAwaitingDrop: false,
	currentTimer: 1000,

	load: function (client) {
		client.on("typingStart", (channel) => {
			if (channel.id === "433831764105101332") {
				this.typingInHangout++;
				if (this.typingInHangout >= 2 && this.isAwaitingDrop && this.currentTimer > 0) {
					this.dropBits(channel);
					this.isAwaitingDrop = false;
					this.currentTimer = 0;
				}
			}
		});

		client.on("typingStop", (channel) => {
			if (channel.id === "433831764105101332") this.typingInHangout--;
			if (!channel.typing) this.typingInHangout = 0;
		});
	},
	getRate: function (rateType = "TRIGGERS") {
		return this[rateType][Math.floor(Math.random() * this[rateType].length)];
	},
	dropBits: function (channel) {
		var bitsDropped = this.getRate("RATES");
		var randomCommand = (channel.guild || channel).data.prefix + this.getRate();
		channel.send({ embed: new RichEmbed()
			.setTitle(bitsDropped + " Bro Bits dropped!")
			.setDescription("Say " + randomCommand + " to collect them!")
			.setColor(0x00AE86)
		}).then((msg) => {
			msg.channel.awaitMessages((m) => m.content.toLowerCase() === randomCommand, { maxMatches: 1, time: 30000, errors: ["time"] }).then((collected) => {
				this.currentTimer = this.getRate("WAIT_RATES");
				getWallet(collected.first().author.id).change(bitsDropped + (Premium(collected.first().author.id)) ? 5 : 0).then(() => {
					collected.first().reply("You collected " + bitsDropped + " Bro Bits!").then((rewardMsg) => {
						rewardMsg.delete(4000);
						msg.delete();
					}).catch(() => {});
				}).catch((exc) => {
					console.warn(exc.stack);
				});
			}).catch(() => {
				msg.delete();
				this.currentTimer = this.getRate("WAIT_RATES");
			});
		}).catch(() => {});
	},
	exec: function (message, client) {
		if (message.channel.id === "433831764105101332" && !this.isAwaitingDrop && this.currentTimer > 0) {
			client.setTimeout(() => {
				this.isAwaitingDrop = true;
			}, this.currentTimer);
		}
	}
};
