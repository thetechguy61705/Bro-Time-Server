var { Guild, TextChannel, RichEmbed } = require("discord.js");
var util = require("util");

const EMOJI = "🎉";

function canHost(user) {
	return user.id === "393532251398209536";
}

function handleError(_, exc) {
	console.warn("Failed to modify giveaway:");
	console.warn(exc.stack);
}

function acceptEntry(client, message, endTime, authorName, giveawayWinners, prize) {
	var runTitle = `${EMOJI} **GIVEAWAY** ${EMOJI}`;
	var runDesc = `**React with ${EMOJI} to enter**\nTime remaining: **%s**`;
	var runEmbed = new RichEmbed()
		.setTitle(prize)
		.setColor(0x00AE86)
		.setFooter(`${client.user.username} | Giveaway by ${authorName}.`);
	var timeout = client.setInterval(() => {
		endTime -= 5000;

		if (endTime > 0) {
			runEmbed.setDescription(util.format(runDesc, endTime.expandPretty()));
			message.edit(runTitle, { embed: runEmbed });
		} else {
			clearInterval(timeout);
			pickWinner(client, message, authorName, giveawayWinners, prize);
		}
	}, 5000);
}

function pickWinner(client, message, authorName, giveawayWinners, prize) {
	message.reactions.find(r => r.emoji.name === EMOJI).fetchUsers().then(users => {
		var winner = users
			.filter(r => r.id !== client.user.id && r.id !== authorName.id)
			.random(giveawayWinners);
		if (winner.length === 0)
			winner = ["**Not enough users entered.**"];
		var endEmbed = new RichEmbed()
			.setTitle(prize)
			.setDescription(`Winner(s): ${winner.join(", ")}`)
			.setColor(0x00AE86)
			.setFooter(`${client.user.username} | Giveaway by ${authorName}.`);

		message.edit(`${EMOJI} **GIVEAWAY ENDED** ${EMOJI}`, {
			embed: endEmbed
		}).then(() => {
			message.delete().catch((exc) => {
				handleError(message, exc);
			});
			if (winner[0] !== "**Not enough users entered.**") {
				message.channel.send(`${winner.join(", ")} won **${prize}**!`).catch((exc) => {
					handleError(message, exc);
				});
			}
		}, (exc) => {
			handleError(message, exc);
		});
	});
}

function reloadGiveaways(channel, client) {
	if (channel instanceof TextChannel && channel.id === "437091372538003456") {
		channel.fetchMessages({ limit: 100 }).then(messagesFetched => {
			var giveawayChannel;
			var giveawayID;
			var giveawayEnd;
			var giveawayWinners;
			var giveawayAuthor;
			var giveawayPrize;
			var args;
			var entryPromise;
			messagesFetched.forEach((creator) => {
				if (canHost(creator.author)) {
					args = creator.content.split(" ");
					giveawayChannel = args[0];
					giveawayID = args[1];
					giveawayEnd = parseInt(args[2]) - Date.now();
					giveawayWinners = parseInt(args[3]);
					giveawayAuthor = client.users.get(args[4]).tag;
					giveawayPrize = args.slice(5).join(" ");
					entryPromise = channel.client.channels.get(giveawayChannel).fetchMessage(giveawayID);
					if (giveawayEnd > 0) {
						entryPromise.then((message) => {
							acceptEntry(client, message, giveawayEnd, giveawayAuthor, giveawayWinners, giveawayPrize);
						});
					} else {
						entryPromise.then((message) => {
							pickWinner(client, message, giveawayAuthor, giveawayWinners, giveawayPrize);
						});
					}
				}
			});
		});
	}
}

module.exports = {
	id: "giveaways",
	exec(area, client) {
		if (area instanceof Guild) {
			for (var channel of area.guilds.values())
				reloadGiveaways(channel, client);
		} else {
			reloadGiveaways(area, client);
		}
	}
};