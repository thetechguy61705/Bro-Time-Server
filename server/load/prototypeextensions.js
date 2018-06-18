const Discord = require("discord.js");

Number.prototype.expandPretty = function() {
	var days = ((this) - (this % 86400000)) / 86400000;
	var hours = (((this) - (this % 3600000)) / 3600000) - (days * 24);
	var minutes = ((this % 3600000) - (this % 3600000) % (60000)) / 60000;
	var seconds = ((this % 3600000) % 60000) - (((this % 3600000) % 60000) % 1000);
	var milliseconds = (((this % 3600000) % 60000) % 1000) - (((this % 3600000) % 60000) % 1);
	days = (days > 1) ? `\`${days}\` days, `: (days === 1) ? `\`${days}\` day, ` : "";
	hours = (hours > 1) ? `\`${hours}\` hours, `: (hours === 1) ? `\`${hours}\` hour, ` : "";
	minutes = (minutes > 1) ? `\`${minutes}\` minutes, `: (minutes === 1) ? `\`${minutes}\` minute, ` : "";
	seconds = ((seconds / 1000) > 1) ? `\`${seconds/1000}\` seconds, `: ((seconds / 1000) === 1) ? `\`${seconds/1000}\` second, ` : "";
	milliseconds = (days === "" && hours === "" && minutes === "" && seconds === "") ? `\`${milliseconds}\` milliseconds.` : `and \`${milliseconds}\` milliseconds.`;
	return `${days}${hours}${minutes}${seconds}${milliseconds}`;
};

Number.prototype.diagnostic = function() {
	return (this <= 0) ? "impossible" : (this < 200) ? "great" : (this < 350) ? "good" : (this < 500) ? "ok" : (this < 750) ? "bad" : (this < 1000) ? "terrible" : "worse than dial up";
};

String.prototype.toNumber = function(num = 0) {
	if (this == "all") {
		return num;
	} else if (this == "half") {
		return num / 2;
	} else if (this == "quarter")  {
		return num / 4;
	} else if (this == "eighth") {
		return num / 8;
	} else if (this == "sixteenth") {
		return num / 16;
	} else if (this.endsWith("%")) {
		return num * Number(this.slice(0, -1)) / 100;
	} else return NaN;
};

Array.prototype.difference = function(arr) {
	return this.filter((val) => !arr.includes(val));
};

Discord.Message.prototype.reactMultiple = async function(reactions) {
	for (var reaction of reactions)
		await this.react(reaction);
};

Discord.Permissions.prototype.list = function(checkAdmin = true) {
	var list = [];
	var containing = this.serialize(checkAdmin);
	for (var name of Object.keys(Discord.Permissions.FLAGS)) {
		if (containing[name])
			list.push(name);
	}
	return list;
};

Discord.Client.prototype.requestPermissions = function(member, channel, permissions = Discord.Permissions.DEFAULT, usage) {
	var has = !(member instanceof Discord.GuildMember) || member.hasPermission(permissions, true, true);
	if (!has)
		channel.send(new Discord.RichEmbed()
			.setTitle("Permissions Required")
			.setDescription(`For ${member.nickname} to:\n` + (usage instanceof Array ?
				usage.map((use) => "• " + use) :
				"• " + usage))
			.setFooter("Permissions: " + (permissions instanceof Discord.Permissions ?
				permissions :
				new Discord.Permissions(permissions)).list().join(", ")));
	return has;
};

Discord.RichEmbed.prototype.setDefaultFooter = function(user) {
	return this.setFooter((this.footer || { text: "" }).text + " " + "Ran by " + user.username + " (" + user.id + ")", user.displayAvatarURL);
};

module.exports.id = "prototypes";
