var games = ["`Roblox`", "`Minecraft`", "`Cuphead`", "`Fortnite`", "`Undertale`", "`Unturned`", "`VRChat`",
		"`PUBG`", "`FNAF`", "`Clash of Clans`", "`Clash Royale`", "`Sims`", "`Terraria`", "`Subnautica`", "`Rocket League`",
		"`Portal`", "`Hat in Time`", "`CSGO`", "`Splatoon`", "`Mario`", "`Starbound`", "`Garry's Mod`", "`Overwatch`",
		"`Call of Duty`", "`Destiny`", "`Psych`"
	];

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

async function awaitReply(message, question, limit = 60000){
	const filter = m => m.author.id === message.author.id;
	message.reply(question).then(async function(){
		try {
			const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
			return collected.first().content;
		} catch (error) {
			return false;
		}
	}).catch(function(){
		message.channel.send(`You attempted to run the \`postgamenigh\` command in ${message.channel}, but I can not chat there`)
			.catch(function(){});
		return "cancel";
	});
}


module.exports = {
	id: "postgamenight",
	load: () => {},
	execute: async (call) => {
		if (call.message.member.roles.has(call.message.guild.roles.find("name", "Game Night Host").id)) {
			const game = await awaitReply(call.message, "What is the game you want to host on?", 60000);
			if (game == "cancel") return call.message.channel.send("Canceled prompt.").catch(function(){});
			var gamerole;
			if (games.includes(game)) {
				gamerole = call.message.guild.roles.find(r=> r.name.toLowerCase() === game.toLowerCase());
			} else {
				gamerole = game;
			}
			const link = await awaitReply(call.message, "What is the link of your game? If none respond with `none`.", 60000);
			if (link == "cancel") return call.message.channel.send("Canceled Prompt.").catch(function(){});
			var islink = isURL(link);
			if (islink || link.toLowerCase() == "none") {
				var varlink;
				if (link.toLowerCase() == "none") {
					varlink = "`none`";
				} else {
					varlink = link;
				}
				const other = await awaitReply(call.message, "Any other information? If none respond with `none`.", 60000);
				if (other == "cancel") return call.message.channel.send("**Canceled Prompt.**").catch(function(){});
				let annchannel = call.message.guild.channels.find("name", "announcements");
				if (games.includes(game)) {
					gamerole.setMentionable(true).then(() => {
						annchannel.send(`**Game:** ${gamerole}\n**Link:** ${varlink}\n**Other Information:** \`${other}\`\n*Posted by ${call.message.author}*`)
							.then(function(){
								game.setMentionable(false).catch(function(){
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
					annchannel.send(`**Game:** ${gamerole}\n**Link:** ${varlink}\n**Other Information:** \`${other}\`\n*Posted by ${call.message.author}*`)
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
