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
	}
] as IOption[];
