module.exports = {
	id: "testguild",
	exec: (client) => {
		var testGuild = client.guilds.get("453694109819994114");
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
					testGuild.roles.find((r) => role.name === r.name).delete();
				}
			});

			client.on("roleUpdate", async function(oldRole, newRole) {
				if (oldRole.guild.id === realGuild.id) {
					if (oldRole.name !== "Multicolored" && newRole.name !== "Multicolored") {
						var role = testGuild.roles.find((r) => oldRole.name === r.name);
						role.edit({ name: newRole.name, color: newRole.hexColor, hoist: newRole.hoist, mentionable: newRole.mentionable })
							.catch((err) => console.warn(err.stack));
					}
				}
			});
		}
	}
};
