var Discord = require("discord.js");
var bot = new Discord.Client();
// deletes  messages from #deleterepchannel if user is not Mantaro. This is for an event!!
bot.on("message", message => {
if (message.channel.id == 419221619550978058 && message.author.id != 213466096718708737) {
message.delete();
}
});
