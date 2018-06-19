module.exports = function kitchenAdmin(member) {
	var kitchenAdmin = (member.highestRole.position >= member.guild.roles.find("name", "Co-Founder").position) ? true : false;
	return kitchenAdmin;
}
