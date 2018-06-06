module.exports = {
	id: "testguild",
	exec: (client) => {
		var testGuild = client.guilds.get("430096406275948554");
		var realGuild = client.guilds.get("330913265573953536");
		if (testGuild != null && realGuild != null) {
			client.on("roleCreate", (role) => {
				if (role.guild.id === realGuild.id) {
					testGuild.createRole({
						name: role.name,
						color: role.color,
						hoist: role.hoist,
						position: role.position,
						mentionable: role.mentionable,
					});
				}
			});

			client.on("roleDelete", (role) => {
				if (role.guild.id === realGuild.id) {
					testGuild.roles.find("name", role.name).delete();
				}
			});

			client.on("roleUpdate", async function(oldRole, newRole) {
				if (oldRole.guild.id === realGuild.id) {
					if (oldRole.name !== "Multicolored" && newRole.name !== "Multicolored") {
						var role = testGuild.roles.find("name", oldRole.name);
						await role.setHoist(newRole.hoist);
						await role.setMentionable(newRole.mentionable);
						await role.setColor(newRole.hexColor);
						await role.setPosition(newRole.position);
						await role.setName(newRole.name);
					}
				}
			});
		}
	}
};
