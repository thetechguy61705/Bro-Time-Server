const Discord = require("discord.js");

Number.prototype.expandPretty = function(ticks = true) {
	var totalS = this,
		hours = Math.floor(totalS / 3600000);
	totalS %= 3600000;
	var minutes = Math.floor(totalS / 60000);
	totalS %= 60000;
	var seconds = Math.floor(totalS / 1000);
	totalS %= 1000;
	var ms = totalS;
	return (`${hours ? `${hours} hour${hours > 1 ? "s" : ""}, ` : ""}` +
		`${minutes ? `${hours && !seconds && !ms ? "and " : ""}${minutes} minute${minutes > 1 ? "s" : ""}, ` : ""}` +
		`${seconds ? `${(hours || minutes) && !ms ? "and " : ""}${seconds} second${seconds > 1 ? "s" : ""}, ` : ""}` +
		`${ms ? `${hours || minutes || seconds ? "and " : ""}${ms} millisecond${ms > 1 ? "s" : ""}.` : ""}`)
		.replace(/\d+/g, (match) => { return ticks ? `\`${match}\`` : match; });
};

Number.prototype.diagnostic = function() {
	return this <= 0 ? "impossible" : this < 200 ? "great" : this < 350 ? "good" : this < 500 ? "ok" : this < 750 ? "bad" : this < 1000 ? "terrible" : "worse than dial up";
};

/* eslint-disable */
String.prototype.count = function(c) {
	var t = 0, l = 0, c = (c + '')[0];
	while(l = this.indexOf(c, l) + 1)
		++t;
	return t;
};
/* eslint-enable */

String.prototype.toNumber = function(num = 0) {
	if (this == "all") {
		return num;
	} else if (this == "half") {
		return num / 2;
	} else if (this == "quarter") {
		return num / 4;
	} else if (this == "eighth") {
		return num / 8;
	} else if (this == "sixteenth") {
		return num / 16;
	} else if (this.endsWith("%")) {
		return num * Number(this.slice(0, -1)) / 100;
	} else {
		return NaN;
	}
};

String.prototype.toBoolean = function() {
	return this == "true" ? true : this == "false" ? false : null;
};

Array.prototype.difference = function(arr) {
	return this.filter((val) => !arr.includes(val));
};

Discord.Message.prototype.reactMultiple = async function(reactions) {
	var results = [];
	for (var reaction of reactions) {
		var result = await this.react(reaction);
		results.push(result);
	}
	return results;
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
			.setDescription(`For ${member.displayName} to:\n` + (Array.isArray(usage) ?
				usage.map((use) => "• " + use) :
				"• " + usage))
			.setFooter("Permissions: " + (permissions instanceof Discord.Permissions ?
				permissions :
				new Discord.Permissions(permissions)).list().join(", ")));
	return has;
};

Discord.RichEmbed.prototype.setDefaultFooter = function(user) {
	return this.setFooter(`${(this.footer || { text: "" }).text} Ran by ${user.username} (${user.id})`, user.displayAvatarURL);
};

module.exports.id = "prototypes";
