// eslint-disable-next-line no-unused-vars
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
		var categories = realGuild.channels.filter(channel => channel.type === "category");
		categories.forEach(function(category) {
			testGuild.createChannel(category.name, "category", category.permissionOverwrites);
		});
	}
};
