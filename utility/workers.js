module.exports = function (member) {
	return member.highestRole.position >= member.guild.roles.find("name", "Workers").position;
};
