const ms = require("ms");

module.exports = {
	id: "for",
	aliases: ["time"],
	run: (call) => {
		var muteTime = call.params.readParameter();
		muteTime = ms((muteTime != null) ? muteTime : " ");
		if (muteTime != null && muteTime > 0 && muteTime < 604800000) {
			var target = call.params.readParameter();
			target = (target != null) ? call.message.guild.members.find((m) => target.includes(m.id) || m.user.tag.startsWith(target)) : target;
			if (target != null) {
				var role = call.params.readRole();
				if (role != null) {
					if (!target.roles.has(role.id)) target.addRole(role).then((newMember) => {
						call.message.reply("Given `" + target.user.tag + "` the `" + role.name + "` role for `" + ms(muteTime, { long: true }) + "`.").catch(() => {});
						// Make a entry in the database of the GuildMember object and the time the user will be de-roled ( Date.now() + muteTime ).
						// Create a loader that would go through all the entries and set a timeout before de-roling the GuildMember.
						call.client.setTimeout(() => {
							if (newMember.roles.has(role.id)) newMember.removeRole(role).catch(() => {});
						}, muteTime);
					});
				} else call.safeSend("Please specify a valid role to grant a user. Example `!role for 10m @user role`.");
			} else call.safeSend("Please specify a valid user to grant a role. Example `!role for 10m @user role`.");
		} else call.safeSend("Please specify a valid amount of time to grant this user this role. Example `!role for 10m @user role`.");
	}
};
