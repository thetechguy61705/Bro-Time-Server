module.exports = {
	exec: (client) => {
		client.guilds.forEach((guild) => {
			var realGuild = client.guilds.get("330913265573953536");
			if (client.user.id === "393532251398209536") {
				const multiColorRole = guild.roles.find("name", "Multicolored");
				const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Yellow"];
				var loopNumber = 0;
				var randomchoice;
				var othercolors;
				var onetimecolors = colors.filter(c => multiColorRole.hex !== realGuild.roles.find("name", c).hex);
				var onetimerandomchoice = Math.floor(Math.random() * onetimecolors.length);
				multiColorRole.setColor(guild.roles.find("name", onetimecolors[onetimerandomchoice]).hexColor).catch(function() {});
				console.log(`Changed color to ${onetimecolors[onetimerandomchoice]}.`);
				client.setInterval(function() {
					othercolors = colors.filter(c => multiColorRole.hex !== realGuild.roles.find("name", c).hex);
					randomchoice = Math.floor(Math.random() * othercolors.length);
					multiColorRole.setColor(guild.roles.find("name", othercolors[randomchoice]).hexColor).catch(function() {});
					console.log(`Changed color to ${othercolors[randomchoice]}.`);
					loopNumber++;
					if (loopNumber === colors.length) loopNumber = 0;
				}, 2000);
			}
		});
	}
};
