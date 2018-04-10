module.exports = {
	exec: (client) => {
		const realGuild = client.guilds.get("330913265573953536");
		console.log(realGuild.name);
	}
};
