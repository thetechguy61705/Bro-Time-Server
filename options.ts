interface IOption {
	// The id must contain alphabetic words separated by underscores.
	id: string
	// Any Postgres data type.
	type: string
	default?: any
	nullable: boolean
	// A Postgres expression that must evaluate to a bool.
	check?: string
}

// Example (for greetings): {id: "Greetings_Enabled", type: "boolean", default: true, nullable: false}
export default [
] as IOption[];
