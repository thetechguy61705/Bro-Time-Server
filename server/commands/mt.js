module.exports = {
	id: "mt",
	load: () => {},
	execute: (call) => {
		let rolename = call.params.readParameter(" ").toLowerCase();
		const prefixes = ["", "-g- ", "[f] ", "[c] "];
		if(message.member.roles.has("414603140399366145")) {
			for (const prefix of prefixes) {
				let role = call.message.guild.roles.find(r=> r.name.toLowerCase() === prefix+rolename);
				if(role) role.setMentionable(!role.mentionable);}
		} else if (message.member.roles.has("414605974205235201")) {
			for (const prefix of prefixes) {
				let role = call.message.guild.roles.find(r=> r.name.toLowerCase() === prefix+rolename);
				if(role) role.setMentionable(!role.mentionable);}
		else {
			call.message.channel.send(`${call.message.author}, you do not have permission to use this command!`);
		}
		call.message.delete();
	}
};
