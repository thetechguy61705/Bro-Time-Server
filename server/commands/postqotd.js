module.exports = {
	id: "postqotd",
	load: () => {},
	execute: (call) => {
  if(message.member.roles.has("392041430610214912")) {
  		let qotd = call.params.readParameter(" ");
      let qotdrole = message.guild.roles.get("387375439745908747");
      qotdrole.setMentionable(true);
      call.message.channel.send(`<@&387375439745908747>:${qotd}`);
  }
  }
};
