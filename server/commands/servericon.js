module.exports = {
id: "servericon",
	load: () => {},
	execute: (call) => {
		var unfetchedinvite = call.params.readRaw()
    client.fetchInvite(unfetchedinvite).then((invite) => {
    message.reply(invite.guild.icon)
    )}.catch(() => {
    message.author.send(`You did not provide a valid invite!`)
    )};
	}
};
