const { RichEmbed } = require("discord.js");
const weather = require("weather-js");

module.exports = {
	id: "weather",
	aliases: ["w"],
	description: "Displays the weather in the area given",
	paramsHelp: "(place)",
	execute: async (call) => {
		var area = call.params.readParam(true);
		if (area) {
			// I have no idea why result is triggering the no-unused error.
			// eslint-disable-next-line no-unused-vars
			var result = weather.find({ search: area, degreeType: "F" }, (err, result) => {
				if (err) console.warn(err.stack);
				result = result[0];
				if (result) {
					var weatherEmbed = new RichEmbed()
						.setTitle(`Weather in ${result.location.name}`)
						.addField("Temperature", `${result.current.temperature} °F.`, true)
						.addField("Feels Like", `${result.current.feelslike} °F.`, true)
						.addField("Humidity", `${result.current.humidity}%`, true)
						.addField("Windspeed", `${result.current.windspeed}.`, true)
						.addField("Sky", `${result.current.skytext}.`, true)
						.setColor(0x00AE86)
						.setDefaultFooter(call.message.author);
					call.safeSend(null, call.message, { embed: weatherEmbed });
				} else call.safeSend("Could not find the area given.");
			});
		} else call.safeSend("Please specify an area to view the weather in.");
	}
};
