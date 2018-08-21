import { Collection, Client, Emoji, Snowflake } from "discord.js";

export const EMOJI_SERVERS: Snowflake[] = [
	"453694109819994114",
	"449723170790965251",
	"449724855278108672"
];

export const EMOJIS: Collection<string, Emoji> = new Collection();

export default {
	id: "emojis",
	exec: (client: Client) => {
		for (var emoji of client.emojis.filter((e: Emoji): boolean => EMOJI_SERVERS.includes(e.guild.id)).array())
			EMOJIS.set(emoji.name, emoji);
	}
};
