const BRO_TIME_GUILDS = ["330913265573953536", "453694109819994114", "463408396872187904", "398948242790023168"];

module.exports = {
	id: "global-ban",
	exec: (client) => {
		client.on("guildBanAdd", (guild, user) => {
			if (BRO_TIME_GUILDS.includes(guild.id)) {
				client.shard.broadcastEval(
					"const BRO_TIME_GUILDS = ['330913265573953536', '453694109819994114', '463408396872187904', '398948242790023168'];" +
					"for (let g of BRO_TIME_GUILDS) {" +
						`if (this.guilds.has(g)) this.guilds.get(g).ban('${user.id}').catch(() => {});` +
					"}"
				);
			}
		});

		client.on("guildBanRemove", (guild, user) => {
			if (BRO_TIME_GUILDS.includes(guild.id)) {
				client.shard.broadcastEval(
					"const BRO_TIME_GUILDS = ['330913265573953536', '453694109819994114', '463408396872187904', '398948242790023168'];" +
					"for (let g of BRO_TIME_GUILDS) {" +
						`if (this.guilds.has(g)) this.guilds.get(g).unban('${user.id}').catch(() => {});` +
					"}"
				);
			}
		});
	}
};
