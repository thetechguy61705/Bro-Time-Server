Number.prototype.expandPretty = function() {
	var days = ((this) - (this % 86400000)) / 86400000;
	var hours = (((this) - (this % 3600000)) / 3600000) - (days * 24);
	var minutes = ((this % 3600000) - (this % 3600000) % (60000)) / 60000;
	var seconds = ((this % 3600000) % 60000) - (((this % 3600000) % 60000) % 1000);
	var milliseconds = (((this % 3600000) % 60000) % 1000) - (((this % 3600000) % 60000) % 1);
	(days > 1) ? days = `\`${days}\` days, `: (days === 1) ? days = `\`${days}\` day, ` : days = "";
	(hours > 1) ? hours = `\`${hours}\` hours, `: (hours === 1) ? hours = `\`${hours}\` hour, ` : hours = "";
	(minutes > 1) ? minutes = `\`${minutes}\` minutes, `: (hours === 1) ? hours = `\`${minutes}\` minute, ` : minutes = "";
	((seconds / 1000) > 1) ? seconds = `\`${seconds/1000}\` seconds, `: ((seconds / 1000) === 1) ? seconds = `\`${seconds/1000}\` second, ` : seconds = "";
	(days === "" && hours === "" && minutes === "" && seconds === "") ? milliseconds = `\`${milliseconds}\` milliseconds.`: milliseconds = `and \`${milliseconds}\` milliseconds.`;
	return `${days}${hours}${minutes}${seconds}${milliseconds}`;
};

Number.prototype.diagnostic = function() {
	return (this <= 0) ? "impossible" : (this < 200)
		? "great" : (this < 350)
		? "good" : (this < 500)
		? "ok" : (this < 750)
		? "bad" : (this < 1000)
		? "terrible" : "worse than dial up";
};

Array.prototype.difference = function(a) {
	return this.filter(function(i) { return a.indexOf(i) < 0; });
};
/*
credits to Joshaven Potter from stackoverflow for this great prototype extension :D
https://stackoverflow.com/users/121607/joshaven-potter
*/
