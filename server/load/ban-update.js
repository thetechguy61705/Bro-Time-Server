const BRO_TIME_GUILDS = ["330913265573953536", "453694109819994114", "463408396872187904", "398948242790023168"];

module.exports = {
	id: "ban-update",
	exec: (client) => {
		client.on("guildBanAdd", (guild, user) => {
			if (BRO_TIME_GUILDS.includes(guild.id)) {
				for (let g of BRO_TIME_GUILDS) {
					if (client.guilds.get(g) != null) client.guilds.get(g).ban(user.id);
				}
			}
		});

		client.on("guildBanRemove", (guild, user) => {
			if (BRO_TIME_GUILDS.includes(guild.id)) {
				for (let g of BRO_TIME_GUILDS) {
					if (client.guilds.get(g) != null) client.guilds.get(g).unban(user.id);
				}
			}
		});
	}
};
