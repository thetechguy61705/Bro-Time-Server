var games = ["roblox", "minecraft", "cuphead", "fortnite", "undertale", "unturned", "vrchat",
	"pubg", "fnaf", "clash of clans", "clash royale", "sims", "terraria", "subnautica", "rocket league",
	"portal", "hat in time", "csgo", "splatoon", "mario", "starbound", "garry's mod", "overwatch",
	"call of duty", "destiny"];

module.exports = {
	id: "gamerole",
	load: () => {},
	execute: (call) => {
		var prms = call.params;
		var role = prms.readRole();
		var rawinput = call.message.content.substr(10);
		if (games.includes(rawinput.toLowerCase())) {
			if (call.message.member.roles.has(role.id)) {
				call.message.member.removeRole(role).then(() => {
					call.message.channel
						.reply(`since you already had the \`${rawinput}\` game role, it has been removed from you!`);
				}).catch(() => {
					call.message.channel.reply(`unable to remove the \`${rawinput}\` game role!`);
				});
			} else {
				call.message.member.addRole(role).then(() => {
					call.message.channel.send(`Successfully given you the \`${rawinput}\` game role!`);
				}).catch(() => {
					call.message.channel.reply(`unable to give you the \`${rawinput}\` game role!`);
				});
			}
		} else {
			call.message.channel
				.reply(`\`${rawinput} \` is not a valid game option.`);
		}
	}
};
