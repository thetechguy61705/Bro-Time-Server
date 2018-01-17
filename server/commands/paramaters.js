class Paramaters {
	constructor(input) {
		// Store the guild for role access.
		this.sep = /^[/s,]+/y;
		this.raw = input;
		this.index = 0;
	}

	ReadRaw() {
		return this.raw.substring(this.index);
	}

	ReadSeparator() {
		this.sep.lastIndex = this.index;
		let match = this.raw.match(this.sep);
		let result;
		if (match !== null) {
			result = match[0];
			this.index += result.length;
		}
		return result;
	}

	ReadWord(classes) {
		let pattern = new RegExp(`^[${classes}a-zA-Z]+`, "y");
		pattern.lastIndex = this.index;
		let match = this.raw.match(pattern);
		let result;
		if (match !== null) {
			result = match[0];
			this.index += result.length;
		}
		return result;
	}

	ReadNumber() {
		// parseFloat
		// Parse the first set of characters, up to the first separator.
	}

	ReadUser() {
		// client
		// Get the user from client.users that matches the most recent parameter.
	}

	ReadRole() {
		// Get the role from a guild that matches the most recent parameter.
	}

	ReadChannel() {
		// Get the channel from a guild that matches the most recent parameter.
	}
}

module.exports = Paramaters;
