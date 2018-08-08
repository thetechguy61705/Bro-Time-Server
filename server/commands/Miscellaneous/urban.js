const { RichEmbed } = require("discord.js");
const { MARKDOWN_REGEX } = require("@server/chat/filter");
const fetch = require("node-fetch");
const emojis = require("@server/load/emojis.js").emojis;

function hyperlinkText(text) {
	return text.replace(/\[(.*?)\]/g, (match) => {
		return `${match}(https://www.urbandictionary.com/define.php?term=${match.replace(/\[|\]/g, "").replace(/\s/g, "+")})`;
	});
}

module.exports = {
	id: "urban",
	aliases: ["urbandictionary"],
	description: "Searches urban dictionary with the supplied query.",
	paramsHelp: "(query)",
	exec: async (call) => {
		var search = call.params.readParam(true);
		if (search != null) {
			var random = search === "random";
			var urban = await fetch("http://api.urbandictionary.com/v0/" + (random ? "random" : `define?term=${search}`));
			urban = await urban.json();
			var [result] = urban.list;
			if (result != null) {
				var urbanEmbed = new RichEmbed()
					.setTitle(result.word)
					.setURL(result.permalink)
					.setColor(0x00AE86)
					.setDefaultFooter(call.message.author)
					.setDescription(hyperlinkText(result.definition).replace(MARKDOWN_REGEX, "").substring(0, 2048) || "None.")
					.addField("Example", hyperlinkText(result.example).replace(MARKDOWN_REGEX, "").substring(0, 1024) || "None.")
					.addField("\u200B", `**${emojis.get("thumbsup")} ${result.thumbs_up} / ${emojis.get("thumbsdown")} ${result.thumbs_down} | ` +
						`Written by ${result.author} at ${result.written_on.substring(0, 10).replace(/-/g, "/")}**`);
				call.safeSend(null, call.message, { embed: urbanEmbed });
			} else call.safeSend("Could not find the given query on urban dictionary.");
		} else call.safeSend("You must specify a query to search urban dictionary with. Supply 'random' for a random urban dictionary result.");
	}
};
