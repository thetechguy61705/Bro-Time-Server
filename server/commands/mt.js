module.exports = {
	id: "mt",
	load: () => {},
	execute: (call) => {
		let rolename = call.args.join(" ").toLowerCase();
		const prefixes = ["", "-g- ", "[f] ", "[c] "];

		for (const prefix of prefixes) {
			let role = call.message.guild.roles.find(r=> r.name.toLowerCase() === prefix+rolename);
			if(role) role.setMentionable(!role.mentionable);
		}
		call.message.delete();
	}
};
