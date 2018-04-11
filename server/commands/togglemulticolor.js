module.exports = {
	id: "togglemulticolor",
	load: () => {},
	execute: (call) => {
		const realGuild = call.client.guilds.get("330913265573953536");
		const multiColorRole = realGuild.roles.find("name", "Multicolored");
		const colors = ["Red", "Blue", "Orange", "Green", "Black", "Purple", "Pink", "Yellow",
			"HotPink", "Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
			"DarkViolet", "Gold"
		];
		var loopNumber = 0;
		setInterval(function() {
			multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]));
			loopNumber = loopNumber + 1;
			if(loopNumber === colors.length) loopNumber = 0;
		}, 1000);
	}
};
