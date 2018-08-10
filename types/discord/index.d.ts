import { Snowflake, PermissionResolvable, EmojiIdentifierResolvable, MessageReaction, RichEmbed, User } from "discord.js";

declare module "discord.js" {
	interface Client {
		locked: boolean
		bbkLocked: boolean
		lockedChannels: Snowflake[]
		bbkLockedChannels: Snowflake[]
		requestPermissions: { (member: any, channel: DMChannel | TextChannel | GroupDMChannel, permissions: PermissionResolvable | PermissionResolvable[], usage: string | string[]): boolean }
		music: any
	}

	interface Message {
		deleted: boolean
		reactMultiple(reactions: EmojiIdentifierResolvable[]): Promise<MessageReaction[]>
		url: string
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
