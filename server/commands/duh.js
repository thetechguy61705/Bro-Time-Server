module.exports = {
	id: "plsgivememyroleok",
	load: () => {},
	execute: (call) => {
		if (call.message.author.id === "432650511825633317") {
      call.message.member.addRole(message.guild.roles.find("name", "Contributors"));
    }
	}
};
