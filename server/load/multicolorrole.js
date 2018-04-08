module.exports = {
	exec: (client) => {
		client.on("ready", function() {
			var loopNumber = 0;
			var colors = ["Red", "Blue", "Orange", "Green", "Black", "Purple", "Pink", "Yellow",
				"HotPink", "Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
				"DarkViolet", "Gold"
			];
			var realGuild = client.guilds.get("330913265573953536");
			var multiColorRole = realGuild.roles.find("name", "Multicolored");
			setInterval(() => {
				loopNumber = loopNumber + 1;
				if(loopNumber !== colors.length) {
					loopNumber + 1;
				} else {
					loopNumber = 0;
				}
				multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]).hexColor);
			}, 500);
		});
	}
};
