const premiumRoles = ["330919872630358026", "402175094312665098", "436013049808420866", "436013613568884736", "396390444738674691"];

module.exports = function premium(member) {
	var newMember = member.client.guilds.get("330913265573953536").member(member.id);
	var premium = (newMember.roles.some(role => premiumRoles.includes(role.id))) ? true : false;
	return premium;
}
