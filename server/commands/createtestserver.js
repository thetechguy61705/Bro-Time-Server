function reverse(str){
	return str.split("").reverse().join("");
}

module.exports = {
	id: "createtestserver",
	load: () => {},
	execute: (call) => {
		if (call.message.author.id != "289380085025472523") return;
		var testGuild = call.client.guilds.get("430096406275948554");
		var realGuild = call.client.guilds.get("330913265573953536");
		realGuild.channels.forEach(async function(channel) {
			await testGuild.createChannel(reverse(channel.name), channel.type, channel.positionOverwrites).then(newChannel => {
				newChannel.setTopic(channel.topic);
				newChannel.setParent(testGuild.channels.find("name", reverse(channel.parent.name)));
				newChannel.setPosition(channel.position);
			});
		});
		realGuild.roles.forEach(async function(role) {
			await testGuild.createRole(role.name, role.color, role.hoist, role.permissions, role.mentionable).then(newRole => {
				newRole.setPosition(role.position);
			});
		});
	}
};
