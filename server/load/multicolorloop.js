module.exports = {
	exec: (client) => {
		client.on("ready", async function() {
			var colors = ["Red", "Blue", "Orange", "Green", "Black", "Purple", "Pink", "Yellow",
				"Hotpink", "Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
				"DarkViolet", "Gold"
			];
			var loopNumber = 0;
			var guild = client.guilds.get("330913265573953536");
			var multiColorRole = guild.roles.find("name", "Multicolored");
			(function() {
				if(loopNumber !== colors.length) {
					loopNumber + 1;
				} else {
					loopNumber = 0;
				}
				multiColorRole.setColor(guild.roles.find("name", colors[loopNumber]));
				setTimeout(arguments.callee, 3000);
			})();
		});
	}
};
