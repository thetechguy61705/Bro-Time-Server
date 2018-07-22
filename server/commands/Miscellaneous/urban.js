const urban = require("urban");
const { RichEmbed } = require("discord.js");

function hyperlinkText(text) {
	var hyperlinks = text.match(/\[(.*?)\]/g);
	for (let link of hyperlinks) {
		text = text.replace(link, `${link}(https://www.urbandictionary.com/define.php?term=${link.replace(/\[|\]/g, "").replace(/ /g, "%20")})`);
	}
	return text;
}

module.exports = {
	id: "urban",
	aliases: ["urbandictionary"],
	description: "Searches urban dictionary with the supplied query.",
	paramsHelp: "(query)",
	exec: (call) => {
		var search = call.params.readParam(true);
		if (search != null) {
			urban(search).first((result) => {
				if (result != null) {
					var urbanEmbed = new RichEmbed()
						.setTitle(result.word)
						.setColor(0x00AE86)
						.setURL(result.permalink)
						.setFooter(`👍 ${result.thumbs_up} / 👎 ${result.thumbs_down} | ` +
							`Written by ${result.author} at ${result.written_on.substring(0, 10).replace(/-/g, "/")}`)
						.setDescription(hyperlinkText(result.definition))
						.addField("Example", hyperlinkText(result.example));
					call.safeSend(null, call.message, { embed: urbanEmbed });
				} else call.safeSend("Could not find the given query on urban dictionary.");
			});
		} else call.safeSend("You must specify a query to search urban dictionary with.");
	}
};
