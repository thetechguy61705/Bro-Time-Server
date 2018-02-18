module.exports = {
	id: "mt",
	load: () => {},
	execute: (call) => {
		let rolename = call.params.readParameter(" ").toLowerCase();
		const prefixes = ["", "-g- ", "[f] ", "[c] "];

		for (const prefix of prefixes) {
			let role = call.message.guild.roles.find(r=> r.name.toLowerCase() === prefix+rolename);
			if((role) && (call.message.member.roles.has("414587931043430410"))) {
				role.setMentionable(!role.mentionable);
			} else if (role) {
				call.message.channel.send(`${call.message.author}, you do not have permission to use this command!`);
			}
		}
		call.message.delete();
	}
};
