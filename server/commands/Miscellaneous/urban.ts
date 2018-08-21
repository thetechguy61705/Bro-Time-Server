import { RichEmbed } from "discord.js";
import { MARKDOWN_REGEX } from "@server/chat/filter";
import { Call } from "@server/chat/commands";
import Request, * as fetch from "node-fetch";
import { EMOJIS as emojis } from "@server/load/emojis";

function hyperlinkText(text: string): string {
	return text.replace(/\[(.*?)\]/g, (match: string) => {
		return `${match}(https://www.urbandictionary.com/define.php?term=${match.replace(/\[|\]/g, "").replace(/\s/g, "+")})`;
	});
}

export default {
	id: "urban",
	aliases: ["urbandictionary"],
	params: [
		{
			type: "any",
			greedy: true,
			failure: "You must specify a query to search urban dictionary with. Supply 'random' for a random urban dictionary result.",
			required: true
		}
	],
	description: "Searches urban dictionary with the supplied query.",
	paramsHelp: "(query)",
	exec: async (call: Call) => {
		var search: string = call.parameters[0],
			random: boolean = search === "random",
			urban: object = await fetch("http://api.urbandictionary.com/v0/" + (random ? "random" : `define?term=${search}`)).then((res: Request) => res.json()),
			[result] = (urban as any).list;
		if (result != null) {
			var urbanEmbed: RichEmbed = new RichEmbed()
				.setTitle(result.word)
				.setURL(result.permalink)
				.setColor(0x00AE86)
				.setDefaultFooter(call.message.author)
				.setDescription(hyperlinkText(result.definition).replace(MARKDOWN_REGEX, "").substring(0, 2048) || "None.")
				.addField("Example", hyperlinkText(result.example).replace(MARKDOWN_REGEX, "").substring(0, 1024) || "None.")
				.addField("\u200B", `**${emojis.get("thumbsup")} ${result.thumbs_up} / ${emojis.get("thumbsdown")} ${result.thumbs_down} | ` +
					`Written by ${result.author} at ${result.written_on.substring(0, 10).replace(/-/g, "/")}**`);
			call.safeSend({ embed: urbanEmbed });
		} else call.safeSend("Could not find the given query on urban dictionary.");
	}
};
