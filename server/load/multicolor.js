module.exports = {
	exec: (client) => {
		var realGuild = client.guilds.get("330913265573953536");
		if (client.user.id === "393532251398209536") {
			const multiColorRole = realGuild.roles.find("name", "Multicolored");
			const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Pink", "Yellow", "HotPink",
				"Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
				"DarkViolet", "Gold"
			];
			var loopNumber = 0;
			var offlineInRole;
			client.setInterval(function() {
				if (require("./commands/Utility/togglecolor").multicolor) {
					offlineInRole = multiColorRole.members.filter(member => member.presence.status === "offline");
					if (offlineInRole.size !== multiColorRole.members.size) {
						multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]).hexColor).catch(function() {});
						loopNumber = loopNumber + 1;
						if (loopNumber === colors.length) loopNumber = 0;
					}
				}
			}, 3.6e+6);
		}
	}
};
