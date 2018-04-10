const colors = ["Red", "Blue", "Orange", "Green", "Purple", "Pink", "Yellow",
	"HotPink", "Indigo", "Bronze", "Cyan", "LightGreen", "Silver", "BrightRed", "HotBrown",
	"DarkViolet", "Gold"
];

function changeColors(realGuild, colors, loopNumber) {
	realGuild.roles.find("name", "Multicolored").setColor(realGuild.roles.find("name", colors[loopNumber]).hexColor)
		.catch(function() {});
	loopNumber = loopNumber + 1;
	if(loopNumber === colors.length) loopNumber = 0;
}

module.exports = {
	id: "togglemulticolor",
	load: () => {},
	execute: (call) => {
		const realGuild = call.client.guilds.get("330913265573953536");
		var loopNumber = 0;
		var loopThroughColors = setInterval(function() {
			changeColors(realGuild, colors, loopNumber)
		}, 1000);
		if(realGuild.roles.find("name", "Multicolored").hexColor !== "#000001") {
			clearInterval(loopThroughColors);
			realGuild.roles.find("name", "Multicolored").setColor("#000001").catch(function() {});
			call.message.channel.send("Toggled Multicolored role to `off`").catch(() => {
				call.message.author
					.send(`You attempted to run the \`togglemulticolor\` command in ${call.message.channel}, but I can not chat there.`)
					.catch(function() {});
			});
		} else {
			call.message.channel.send("Toggled Multicolored role to `on`").catch(() => {
				call.message.author
					.send(`You attempted to run the \`togglemulticolor\` command in ${call.message.channel}, but I can not chat there.`)
					.catch(function() {});
			});
		}
	}
};
