module.exports = {
	exec: (client) => {
		client.guilds.forEach((guild) => {
			if (client.user.id === "393532251398209536") {
				const multiColorRole = guild.roles.find("name", "Multicolored");
				if (multiColorRole) {
					const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Yellow"];
					if (guild.roles.find("name", "Red") 
					&& guild.roles.find("name", "Blue")
					&& guild.roles.find("name", "Orange")
					&& guild.roles.find("name", "Green")
					&& guild.roles.find("name", "Purple")
					&& guild.roles.find("name", "Yellow")) {
						var loopNumber = 0;
						var randomchoice;
						var othercolors;
						var onetimecolors = colors.filter(c => multiColorRole.hex !== guild.roles.find("name", c).hex);
						var onetimerandomchoice = Math.floor(Math.random() * onetimecolors.length);
						multiColorRole.setColor(guild.roles.find("name", onetimecolors[onetimerandomchoice]).hexColor).catch(function() {});
						console.log(`Changed color to ${onetimecolors[onetimerandomchoice]}.`);
						client.setInterval(function() {
							othercolors = colors.filter(c => multiColorRole.hex !== guild.roles.find("name", c).hex);
							randomchoice = Math.floor(Math.random() * othercolors.length);
							multiColorRole.setColor(guild.roles.find("name", othercolors[randomchoice]).hexColor).catch(function() {});
							console.log(`Changed color to ${othercolors[randomchoice]}.`);
							loopNumber++;
							if (loopNumber === colors.length) loopNumber = 0;
						}, 2000);
					}
				}
			}
		});
	}
};
