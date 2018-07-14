const modRoles = ["436013049808420866", "436013613568884736", "402175094312665098", "330919872630358026"];
const { User, GuildMember } = require("discord.js");

module.exports = function isModerator(member) {
	var result = false;
	if (member instanceof GuildMember || member instanceof User) {
		member = member.client.guilds.has("330913265573953536") ?
			member.client.guilds.get("330913265573953536").member(member.id) :
			member.client.guilds.first().member(member.id);
		// todo: Change this to work for future settings, this can currently be abused if local testing on a bot without access to Bro Time.
		if (member != null && member instanceof GuildMember) {
			if (member.hasPermission("ADMINISTRATOR") || member.roles.some((role) => modRoles.includes(role.id)))
				result = true;
		}
	} else throw new TypeError("Parameter must be an instance of User or GuildMember..");
	return result;
};
