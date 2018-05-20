module.exports = {
	exec: (client) => {
		var realGuild = bot.guilds.get("330913265573953536");
		if (bot.user.id === "433065327836790784") {
			const multiColorRole = realGuild.roles.find("name", "Multicolored");
			const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Yellow"];
			var loopNumber = 0;
			var randomchoice;
			var othercolors;
			bot.setInterval(function() {
				othercolors = colors.filter(c => multiColorRole.hexColor !== c)
				randomchoice = Math.floor(Math.random() * othercolors.length);
				multiColorRole.setColor(realGuild.roles.find("name", othercolors[randomchoice]).hexColor).catch(function() {});
				console.log(`Changed color to ${othercolors[randomchoice]}.`);
				loopNumber++;
				if (loopNumber === colors.length) loopNumber = 0;
			}, 1000);
		}
	}
};
