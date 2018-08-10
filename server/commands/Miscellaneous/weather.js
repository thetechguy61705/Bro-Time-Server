const { RichEmbed } = require("discord.js");
const weather = require("weather-js");

module.exports = {
	id: "weather",
	aliases: ["w"],
	description: "Displays the weather in the area given",
	paramsHelp: "(place)",
	exec: async (call) => {
		var area = call.params.readParam(true);
		if (area) {
			weather.find({ search: area, degreeType: "F" }, (err, result) => {
				if (err) console.warn(err.stack);
				result = result[0];
				if (result) {
					var weatherEmbed = new RichEmbed()
						.setTitle(`Weather in ${result.location.name}`)
						.addField("Temperature", `${result.current.temperature} °F.`, true)
						.addField("Feels Like", `${result.current.feelslike} °F.`, true)
						.addField("Humidity", `${result.current.humidity}%`, true)
						.addField("Sky", `${result.current.skytext}.`, true)
						.addField("Last Updated", result.current.observationtime, true)
						.addField("Windspeed", `${result.current.windspeed}.`, true)
						.setColor(0x00AE86)
						.setDefaultFooter(call.message.author);
					call.safeSend({ embed: weatherEmbed });
				} else call.safeSend("Could not find the area given.");
			});
		} else call.safeSend("Please specify an area to view the weather in.");
	}
};
