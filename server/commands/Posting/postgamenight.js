var games = ["roblox", "minecraft", "cuphead", "fortnite", "undertale", "unturned", "vrchat",
	"pubg", "fnaf", "clash of clans", "clash royale", "sims", "terraria", "subnautica", "rocket league",
	"portal", "hat in time", "csgo", "splatoon", "mario", "starbound", "garry's mod", "overwatch",
	"call of duty", "destiny", "psych", "bro time games"];

function isURL(str) {
	var pattern = new RegExp("^(https?:\\/\\/)?"+
	"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|"+
	"((\\d{1,3}\\.){3}\\d{1,3}))"+
	"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*"+
	"(\\?[;&a-z\\d%_.~+=-]*)?"+
	"(\\#[-a-z\\d_]*)?$", "i");
	return pattern.test(str);
	// credit to Tom Gullen https://stackoverflow.com/users/356635/tom-gullen from stackoverflow <3
}

module.exports = {
	id: "postgamenight",
	description: "Posts the specified \"Gamenight\" in <#330920609435353090>.",
	arguments: "... prompt",
	requires: "Role: Game Night Host",
	execute: async (call) => {
		if (call.message.member.roles.has(call.message.guild.roles.find("name", "Game Night Host").id)) {
			var game = await call.requestInput(0, "What is the game you want to host on?", 60000);
			if (game.message.content.toLowerCase() == "cancel") return call.message.channel.send("Canceled prompt.").catch(function(){});
			var gamerole;
			if (games.includes(game.message.content.toLowerCase())) {
				gamerole = call.message.guild.roles.find(r=> r.name.toLowerCase() === game.message.content.toLowerCase());
			} else {
				gamerole = game.message.content;
			}
			var link = await call.requestInput(0, "What is the link of your game? If none respond with `none`.", 60000);
			if (link.message.content.toLowerCase() == "cancel") return call.message.channel.send("Canceled Prompt.").catch(function(){});
			var islink = isURL(link.message.content);
			if (islink || link.message.content.toLowerCase() == "none") {
				var varlink;
				if (link.message.content.toLowerCase() == "none") {
					varlink = "`none`";
				} else {
					varlink = link.message.content;
				}
				var other = await call.requestInput(0, "Any other information? If none respond with `none`.", 60000);
				if (other.message.content.toLowerCase() == "cancel") return call.message.channel.send("**Canceled Prompt.**").catch(function(){});
				let annchannel = call.message.guild.channels.find("name", "announcements");
				if (games.includes(game.message.content.toLowerCase())) {
					gamerole.setMentionable(true).then(() => {
						annchannel.send(`**Game:** ${gamerole}\n**Link:** ${varlink}\n**Other Information:** \`${other.message.content}\`\n*Posted by ${call.message.author}*`)
							.then(function(){
								gamerole.setMentionable(false).catch(function(){
									call.message.author
										.send(`Could not change the role mentionability of ${gamerole.name} back to normal. Please do this manually.`)
										.catch(function(){});
								});
							}).catch(function(){
								call.message.author.send(`There was an error while sending a message in ${annchannel}.`).catch(function(){});
							});
					}).catch(() => {
						call.message.channel.send("Something went wrong and I couldn't toggle the role mentionability.").catch(function(){
							call.message.author
								.send(`You attempted to run the \`postgamenight\` command in ${call.message.channel}, but I can not chat there.`)
								.catch(function(){});
						});
					});
				} else {
					annchannel.send(`**Game:** ${gamerole}\n**Link:** ${varlink}\n**Other Information:** \`${other.message.content}\`\n*Posted by ${call.message.author}*`)
						.catch(function(){
							call.message.author.send(`There was an error while sending a message in ${annchannel}.`).catch(function(){});
						});
				}
			} else {
				call.message.channel.send("Invalid link supplied.").catch(function(){
					call.message.author
						.send(`You attempted to run the \`postgamenight\` command in ${call.message.channel}, but I can not chat there`)
						.catch(function(){});
				});
			}
		} else {
			call.message.channel.send("Error: missing role: `Game Night Host`").catch(function(){
				call.message.author
					.send(`You attempted to run the \`postgamenight\` command in ${call.message.channel}, but I can not chat there`)
					.catch(function(){});
			});
		}
	}
};
