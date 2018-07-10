module.exports = {
	id: "multicolor",
	needs: "330913265573953536",
	exec: (client) => {
		for (let guild of client.guilds.array()) {
			if (client.user.id === "393532251398209536") {
				var brotime = client.guilds.get("330913265573953536");
				var multiColorRole = guild.roles.find("name", "Multicolored");
				if (multiColorRole) {
					const colors = ["Orange", "Blue", "Gold", "Indigo", "Pink", "Bronze",
						"Yellow", "Purple", "Cyan", "HotPink", "Green", "HotBrown", "Magenta", "BrightRed",
						"LimeGreen", "DarkViolet", "GrayBlue", "Red", "DarkGreen", "Salmon", "LightGreen"];
					const hexcolors = colors.map((c) => brotime.roles.find("name", c).hexColor);
					var loopNumber = hexcolors.indexOf(multiColorRole.hexColor) + 1;
					if (!loopNumber) loopNumber = 0;
					if (loopNumber === colors.length) loopNumber = 0;
					multiColorRole.setColor(brotime.roles.find("name", colors[loopNumber]).hexColor).catch(() => {});
					loopNumber++;
					client.setInterval(() => {
						if (loopNumber === colors.length) loopNumber = 0;
						multiColorRole.setColor(brotime.roles.find("name", colors[loopNumber]).hexColor).catch(() => {});
						loopNumber++;
						if (loopNumber === colors.length) loopNumber = 0;
					}, 3600000);
				}
			}
		}
	}
};
