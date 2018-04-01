// eslint-disable-next-line no-unused-vars
function reverse(str){
	return str.split("").reverse().join("");
}

module.exports = {
	id: "nerdify",
	load: () => {},
	execute: (call) => {
		if (call.message.author.id != "289380085025472523") return;
		var testGuild = call.client.guilds.get("430096406275948554");
		var realGuild = call.client.guilds.get("330913265573953536");
		var channels = realGuild.channels.filter(channel => channel.type === "voice");
		channels.forEach(function(channel) {
			testGuild.createChannel(channel.name, "voice", channel.permissionOverwrites).then(function(newChannel) {
				newChannel.setParent(testGuild.channels.find("name", channel.parent.name));
			});
		});
	}
};
