module.exports = function (text) {
	return text.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
};
