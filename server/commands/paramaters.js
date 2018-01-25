var SPACE = "/s,";

class Paramaters {
	constructor(message) {
		// Store the guild for role access.
		this.sep = new RegExp(`^[${SPACE}]+`, "y");
		this.raw = message.content;
		this.guild = message.guild;
		this.index = 0;
	}

	ReadRaw() {
		return this.raw.substring(this.index);
	}

	ReadSeparator() {
		this.sep.lastIndex = this.index;
		var match = this.raw.match(this.sep);
		if (match !== null) {
			this.index += match[0].length;
			return match[0];
		}
	}

	ReadParameter() {
		var pattern = new RegExp(`^[^${SPACE}]+`, "y");
		pattern.lastIndex = this.index;
		var match = this.raw.match(pattern);
		if (match !== null) {
			this.index += match[0].length;
			return match[0];
		}
	}

	ReadWord(classes) {
		var pattern = new RegExp(`^[${classes}a-zA-Z]+`, "y");
		pattern.lastIndex = this.index;
		var match = this.raw.match(pattern);
		if (match !== null) {
			this.index += match[0].length;
			return match[0];
		}
	}

	ReadNumber() {
		var param = this.ReadParameter();
		if (param !== null) {
			var number = parseFloat(param);
			if (!isNaN(number)) {
				return number;
			}
		}
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
