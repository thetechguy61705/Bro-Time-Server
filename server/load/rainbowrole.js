module.exports = {
	exec: (client) => {
		const realGuild = client.guilds.get("330913265573953536");
		console.log(require("util").inspect(realGuild));
		const multiColorRole = realGuild.roles.find("name", "Multicolored");
		const colors = ["red", "blue", "orange", "green", "black", "purple", "pink", "yellow",
			"hotpink", "indigo", "bronze", "cyan", "lightgreen", "silver", "brightred", "hotbrown",
			"darkviolet", "gold"
		];
		var loopNumber = 0;
		setInterval(function() {
			multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]));
			loopNumber = loopNumber + 1;
			if(loopNumber === colors.length) loopNumber = 0;
		}, 1000);
	}
};
