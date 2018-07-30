const { RichEmbed } = require("discord.js");
const urban = require("urban-dictionary");
const emojis = require("@server/load/emojis.js").emojis;

function hyperlinkText(text) {
	var hyperlinks = text.match(/\[(.*?)\]/g);
	for (let link of hyperlinks || []) {
		text = text.replace(link, `${link}(https://www.urbandictionary.com/define.php?term=${encodeURI(link.replace(/\[|\]/g, ""))})`);
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
			urban[search === "random" ? "random" : "term"](search === "random" ? null : search).then((result) => {
				if (search !== "random") [result] = result.entries;
				if (result != null) {
					var urbanEmbed = new RichEmbed()
						.setTitle(result.word)
						.setURL(result.permalink)
						.setColor(0x00AE86)
						.setDefaultFooter(call.message.author)
						.setDescription(hyperlinkText(result.definition).substring(0, 2048) || "None")
						.addField("Example", hyperlinkText(result.example).substring(0, 1024) || "None.")
						.addField("\u200B", `**${emojis.get("thumbsup")} ${result.thumbs_up} / ${emojis.get("thumbsdown")} ${result.thumbs_down} | ` +
							`Written by ${result.author} at ${result.written_on.substring(0, 10).replace(/-/g, "/")}**`);
					call.safeSend(null, call.message, { embed: urbanEmbed });
				} else call.safeSend("Could not find the given query on urban dictionary.");
			});
		} else call.safeSend("You must specify a query to search urban dictionary with. Supply 'random' for a random urban dictionary result.");
	}
};
