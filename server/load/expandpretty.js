Number.prototype.expandPretty = function() {
	var days = ((this) - (this % 86400000)) / 86400000;
	var hours = (((this) - (this % 3600000)) / 3600000) - (days * 24);
	var minutes = ((this % 3600000) - (this % 3600000) % (60000)) / 60000;
	var seconds = ((this % 3600000) % 60000) - (((this % 3600000) % 60000) % 1000);
	var milliseconds = (((this % 3600000) % 60000) % 1000) - (((this % 3600000) % 60000) % 1);
	(days > 1) ? days = `\`${days}\` days, ` : (days === 1) ? days = `\`${days}\` day, ` : days = "";
	(hours > 1) ? hours = `\`${hours}\` hours, ` : (hours === 1) ? hours = `\`${hours}\` hour, ` : hours = "";
	(minutes > 1) ? minutes = `\`${minutes}\` minutes, ` : (hours === 1) ? hours = `\`${minutes}\` minute, ` : minutes = "";
	((seconds / 1000) > 1) ? seconds = `\`${seconds/1000}\` seconds, ` : ((seconds / 1000) === 1) ? seconds = `\`${seconds/1000}\` second, ` : seconds = "";
	(days === "" && hours === "" && minutes === "" && seconds === "") ? milliseconds = `\`${milliseconds}\` milliseconds.` : milliseconds = `and \`${milliseconds}\` milliseconds.`;
	return `${days}${hours}${minutes}${seconds}${milliseconds}`;
}
