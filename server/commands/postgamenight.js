async function awaitReply(message,question, limit = 60000){
    const filter = m => m.author.id === call.message.author.id;
    await call.message.channel.send(question);
    try {
      const collected = await call.message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] });
      return collected.first().content;
    } catch (error) {
      console.log(error)
      return false;
    }
  }


module.exports = {
	id: "postgamenight",
	load: () => {},
	execute: (call) => {
		if(call.message.member.roles.has("392041430610214912")) {
			const game = await awaitReply(message, "Game Name?\nSay **cancel** to cancel prompt.", 60000);
      if(game = "cancel") return call.message.channel.send("**Cancelled Prompt.**");
			const link = await awaitReply(message, "Game Link?\nSay **cancel** to cancel prompt.", 60000);
      if(link = "cancel") return call.message.channel.send("**Cancelled Prompt.**");
			const other = await awaitReply(message, "Other Information? Say **None** if there is no other information.\nSay **cancel** to cancel prompt.", 60000);
      if(other = "cancel") return call.message.channel.send("**Cancelled Prompt.**");
      let gamerole = message.guild.roles.find("name", `-G- ${game}`);
      if (!gamerole) {
      call.message.channel
      .send(`**Game:** ${game}\n**Link:** ${link}\n**Other Information:** ${other}\n*Posted by ${call.message.author}`)
      } else {
      call.message.channel
      .send(`**Game:** <@&${gamerole.id}>\n**Link:** ${link}\n**Other Information:** ${other}\n*Posted by ${call.message.author}`)

		}
	}
};
