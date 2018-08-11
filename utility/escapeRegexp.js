module.exports = function escape(text) {
	return text.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
};
