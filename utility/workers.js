module.exports = function worker(member) {
	var worker = (member.highestRole.position >= member.guild.roles.find("name", "Workers").position) ? true : false;
	return worker;
};
