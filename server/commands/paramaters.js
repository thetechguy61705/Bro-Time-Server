class Paramaters {
	_sep = /^[\s,]+/y;
	_raw;
	_index;
	
	constructor(input) {
		_raw = input;
		_index = 0;
	}
	
	ReadRaw() {
		return _raw.substring(_index);
	}
	
	ReadSeparator() {
		_sep.lastIndex = _index;
		let match = _raw.match(_sep);
		let result;
		if (match != null) {
			result = match[0]
			_index += result.length;
		}
		return result;
	}
	
	ReadWord(classes) {
		let pattern = new RegExp(`^[${classes || ""}a-zA-Z]+`, "y");
		pattern.lastIndex = _index;
		let match = _raw.match(pattern);
		let result;
		if (match != null) {
			result = match[0];
			_index += result.length;
		}
		return result;
	}
}

module.exports = Paramaters
