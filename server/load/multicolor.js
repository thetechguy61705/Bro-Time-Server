module.exports = {
	id: "multicolor",
	exec: (client) => {
		client.guilds.forEach((guild) => {
			if (client.user.id === "393532251398209536") {
				var brotime = client.guilds.get("330913265573953536");
				var multiColorRole = guild.roles.find("name", "Multicolored");
				if (multiColorRole) {
					const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Yellow"];
					const hexcolors = colors.map(c => brotime.roles.find("name", c).hexColor);
					var loopNumber = hexcolors.indexOf(multiColorRole.hexColor) + 1;
					if (!loopNumber) loopNumber = 0;
					if (loopNumber === colors.length) loopNumber = 0;
					multiColorRole.setColor(brotime.roles.find("name", colors[loopNumber]).hexColor).catch(function() {});
					loopNumber++;
					client.setInterval(function() {
						if (loopNumber === colors.length) loopNumber = 0;
						multiColorRole.setColor(brotime.roles.find("name", colors[loopNumber]).hexColor).catch(function() {});
						loopNumber++;
						if (loopNumber === colors.length) loopNumber = 0;
					}, 3600000);
				}
			}
		});
	}
};
