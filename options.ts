interface IOption {
	// The id must contain alphabetic words separated by underscores.
	id: string
	description?: string
	// Any Postgres data type or an array describing an enum.
	type: string | {name: string, value: number}[]
	// If the type is an enum, is it a flaggable enum.
	flaggable?: boolean
	// If provided, the user's input will be passed in to get the actual value.
	mapping?: { (input: any): any }
	default?: any
	nullable: boolean
	// A Postgres expression that must evaluate to a boolean.
	check?: string
}

// Example (for greetings): {id: "Greetings_Enabled", type: "boolean", default: true, nullable: false}
export default [
	{
		id: "Music_Filtering",
		description: "What types of songs are prevented from playing.",
		type: [
			{name: "explicit", value: 0x1},
			{name: "low rating", value: 0x2},
			{name: "loud", value: 0x4}
		],
		flaggable: true,
		nullable: true
	},
	{
		id: "Greetings_Enabled",
		description: "Whether or not greetings are enabled on the server.",
		type: "boolean",
		default: true,
		nullable: false
	},
	{
		id: "Music_DJs",
		description: "Dj users and roles in the server.",
		type: "bigint[]",
		default: [],
		nullable: false
	},
	{
		id: "Music_Disabled_Channels",
		description: "Channels that music cannot be played in.",
		type: "bigint[]",
		default: [],
		nullable: false
	},
	{
		id: "Moderators",
		description: "Users/roles with access to moderation features.",
		type: "bigint[]",
		default: [],
		nullable: false
	},
	{
		id: "Mute_Role",
		description: "The role assigned to users when they are muted in the server.",
		type: "bigint",
		nullable: true
	},
	{
		id: "Bad_Words",
		description: "Words disabled from being sent in the server.",
		type: "varchar[]",
		default: [],
		nullable: false
	},
	{
		id: "Log_Types",
		description: "Types of actions to be logged in the logs of the server.",
		type: "varchar(20)[]",
		default: [
			"CHANNEL_CREATE",
			"CHANNEL_UPDATE",
			"CHANNEL_DELETE",
			"ROLE_CREATE",
			"ROLE_UPDATE",
			"ROLE_DELETE",
			"EMOJI_CREATE",
			"EMOJI_UPDATE",
			"EMOJI_DELETE",
			"MEMBER_BAN_ADD",
			"MEMBER_BAN_REMOVE",
			"MESSAGE_DELETE",
			"MESSAGE_UPDATE",
			"MESSAGE_DELETE_BULK",
			"MEMBER_BANNED_CMD",
			"MEMBER_UNBANNED_CMD",
			"MEMBER_MUTED_CMD",
			"MEMBER_UNMUTED_CMD",
			"MEMBER_KICKED_CMD",
			"MEMBER_WARNED"
		],
		nullable: false
	},
	{
		id: "Filter_Invites",
		description: "Stop invitations to other servers from being sent in the server.",
		type: "boolean",
		default: false,
		nullable: false
	},
] as IOption[];
