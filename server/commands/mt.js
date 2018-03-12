module.exports = {
	id: "mt",
	load: () => {},
	execute: (call) => {
		let rolename = call.params.readRaw(" ").toLowerCase();
		const prefixes = ["", "[f] ", "[c] "];
		if(call.message.member.roles
			.some(r=>["330919872630358026", "402175094312665098", "395265037356236810", "387768886096953355"]
				.includes(r.id)) ) {
			for (const prefix of prefixes) {
				let role = call.message.guild.roles.find(r=> r.name.toLowerCase() === prefix+rolename);
				if(role) role.setMentionable(!role.mentionable);
			}
		} else {
			call.message.channel.send(`${call.message.author}, you do not have permission to use this command!`);
		}
		call.message.delete();
	}
};
