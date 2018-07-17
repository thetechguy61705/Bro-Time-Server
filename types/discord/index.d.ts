import { Snowflake, MessageReaction, Emoji, ReactionEmoji, User, UserResolveable, RichEmbed } from "discord.js";

declare module "discord.js" {
	interface Client {
		locked: boolean
		bbkLocked: boolean
		lockedChannels: Snowflake[]
		bbkLockedChannels: Snowflake[]
		music: any
	}

	interface Message {
		deleted: boolean
		reactMultiple(reactions: string[] | Emoji[] | ReactionEmoji[]): Promise<MessageReaction[]>
	}

	interface Guild {
		readonly data: any
	}

	interface Channel {
		readonly data: any
	}

	interface RichEmbed {
		setDefaultFooter(user: User): RichEmbed
	}
}
