// eslint-disable-next-line no-unused-vars
function reverse(str){
	return str.split("").reverse().join("");
}

module.exports = {
	id: "createtestserver",
	load: () => {},
	execute: (call) => {
		if (call.message.author.id != "289380085025472523") return;
		// eslint-disable-next-line no-unused-vars
		var testGuild = call.client.guilds.get("430096406275948554");
		// eslint-disable-next-line no-unused-vars
		var realGuild = call.client.guilds.get("330913265573953536");
		realGuild.roles.forEach(function(role) {
			testGuild.createRole({
				name: role.name,
				color: role.color,
				hoist: role.hoist,
				mentionable: role.mentionable,
			});
		});
	}
};
