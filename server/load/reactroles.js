bot.on("ready", async () => {
        console.log(`${bot.user.username} is online!`);
        bot.user.setActivity("this server", {
                type: "WATCHING"
        });
        const freeroles = ["QOTD", "ANN", "GW", "MOVIES"];
        const games = ["Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
    "PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
    "Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
    "Call of Duty", "Destiny", "Psych"];
        const neededadded = ["QOTD", "ANN", "GW", "MOVIES", "Roblox", "Minecraft", "Cuphead", "Fortnite", "Undertale", "Unturned", "VRChat",
  "PUBG", "FNAF", "Clash of Clans", "Clash Royale", "Sims", "Terraria", "Subnautica", "Rocket League",
  "Portal", "Hat in Time", "CSGO", "Splatoon", "Mario", "Starbound", "Garry's Mod", "Overwatch",
  "Call of Duty", "Destiny", "Psych"];
        var reactchannel = bot.channels.find("name", "react-for-roles")
        reactchannel.fetchMessages({
                limit: 100
        }).then((messages) => {
                messages.forEach((msg) => {
                        if (msg.embeds[0]) {
                                var index = neededadded.indexOf(msg.embeds[0].title);
                                if (index > -1) {
                                        neededadded.splice(index, 1);
                                }
                        }
                })
                if (neededadded.length > 0) {
                        neededadded.forEach(async (value) => {
                                var embed = new Discord.RichEmbed().setTitle(value).setDescription(`React to get the ${value} role!`)
                                reactchannel.send(embed).then((m) => {
                                        let emote = reactchannel.guild.emojis.find("id", "404768960014450689")
                                        m.react(emote)
                                })
                        })
                }
        })
});
bot.on("messageReactionAdd", async (messageReaction, user) => {
        var reactchannel = bot.channels.find("name", "react-for-roles")
        if (messageReaction.message.channel === reactchannel && messageReaction.message.author === bot.user) {
                var title = messageReaction.message.embeds[0].title
                var role = reactchannel.guild.roles.find("name", title)
                var member = reactchannel.guild.members.get(user.id)
                if (member.roles.has(role)) {
                        member.removeRole(role).then(() => {
                                messageReaction.remove(user)
                        })
                } else {
                        member.addRole(role).then(() => {
                                messageReaction.remove(user)
                        })
                }
        }
})
