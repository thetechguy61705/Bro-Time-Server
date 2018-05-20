module.exports = {
	exec: (client) => {
		var realGuild = client.guilds.get("330913265573953536");
		if (client.user.id === "393532251398209536") {
			const multiColorRole = realGuild.roles.find("name", "Multicolored");
			const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Pink", "Yellow"];
			var loopNumber = 0;
			var randomchoice;
			var index;
			var othercolors;
			client.setInterval(function() {
				othercolors = colors.map(r => realGuild.roles.find("name", r).hexColor);
				index = othercolors.indexOf(multiColorRole.hexColor);
				if (index > -1) {
					othercolors.splice(index, 1);
				}
				randomchoice = Math.floor(Math.random() * othercolors.length);
				multiColorRole.setColor(realGuild.roles.find("name", othercolors[randomchoice]).hexColor).catch(function() {});
				console.log(`Changed color to ${othercolors[randomchoice]}.`);
				loopNumber = loopNumber + 1;
				if (loopNumber === colors.length) loopNumber = 0;
			}, 3600000);
		}
	}
};
