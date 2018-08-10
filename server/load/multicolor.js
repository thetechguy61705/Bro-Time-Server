const colors = [
	"Orange",
	"Blue",
	"Gold",
	"Indigo",
	"Pink",
	"Bronze",
	"Yellow",
	"Purple",
	"Cyan",
	"HotPink",
	"Green",
	"HotBrown",
	"Magenta",
	"BrightRed",
	"LimeGreen",
	"DarkViolet",
	"GrayBlue",
	"Red",
	"DarkGreen",
	"Salmon",
	"LightGreen"
];

module.exports = {
	id: "multicolor",
	exec: (client) => {
		for (let guild of client.guilds.array()) {
			if (client.user.id === "393532251398209536") {
				var brotime = client.guilds.get("330913265573953536");
				if (brotime != null) {
					var multiColorRole = guild.roles.find((role) => role.name === "Multicolored");
					if (multiColorRole) {
						var hexcolors = colors.map((c) => brotime.roles.find((role) => role.name === c).hexColor);
						var loopNumber = hexcolors.indexOf(multiColorRole.hexColor) + 1;
						if (!loopNumber) loopNumber = 0;
						if (loopNumber === colors.length) loopNumber = 0;
						if (multiColorRole) multiColorRole.setColor(brotime.roles.find((role) => role.name === colors[loopNumber]).hexColor).catch(() => {});
						loopNumber++;
						client.setInterval(() => {
							if (loopNumber === colors.length) loopNumber = 0;
							if (multiColorRole) multiColorRole.setColor(brotime.roles.find((role) => role.name === colors[loopNumber]).hexColor).catch(() => {});
							loopNumber++;
							if (loopNumber === colors.length) loopNumber = 0;
						}, 3600000);
					}
				} else break;
			} else break;
		}
	}
};
