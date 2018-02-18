module.exports = {
	id: "mt",
	load: () => {},
	execute: (call) => {
		let rolename = call.params.readParameter(" ").toLowerCase();
		const prefixes = ["", "-g- ", "[f] ", "[c] "];
		const allowed = ["414590269997187073", "414590282143891457", "414590302184275978", "414590310795182110"];

		for ((const prefix of prefixes) && (const id of allowed)) {
			let role = call.message.guild.roles.find(r=> r.name.toLowerCase() === prefix+rolename);
			if((role) && (call.message.member.roles.has(id))) {
				role.setMentionable(!role.mentionable);
			} else if (role) {
				call.message.channel.send(`${call.message.author}, you do not have permission to use this command!`);
			}
		}
		call.message.delete();
	}
};
