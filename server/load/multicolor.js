module.exports = {
	exec: (client) => {
		console.log("Loaded Multicolor");
		var realGuild = client.guilds.get("330913265573953536");
		if (client.user.id === "393532251398209536") {
			const multiColorRole = realGuild.roles.find("name", "Multicolored");
			const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Pink", "Yellow"];
			const othercolors = colors.map(r => realGuild.roles.find("name", r).hexColor);
			var index = othercolors.indexOf(multiColorRole.hexColor);
    			if (index > -1) {
       				othercolors.splice(index, 1);
   			}
			var randomchoice = Math.floor(Math.random() * othercolors.length);
			multiColorRole.setColor(realGuild.roles.find("name", othercolors[randomchoice]).hexColor).catch(function() {});
			var loopNumber = 0;
			var offlineInRole;
			client.setInterval(function() {
				offlineInRole = multiColorRole.members.filter(member => member.presence.status === "offline");
				if (offlineInRole.size !== multiColorRole.members.size) {
					multiColorRole.setColor(realGuild.roles.find("name", colors[loopNumber]).hexColor).catch(function() {});
					loopNumber = loopNumber + 1;
					if (loopNumber === colors.length) loopNumber = 0;
				}
			}, 3600000);
		}
	}
};
