var { Collection, GuildChannel, RichEmbed } = require("discord.js");
var running = [];

function getScope(channel) {
	return channel instanceof GuildChannel ? channel.guild.id : channel.id;
}

function replaceTags(content, values) {
	var result = content;
	if (content instanceof RichEmbed) {
		result.setTitle(replaceTags(content.title, values));
		result.setDescription(replaceTags(content.description, values));
		result.setFooter(replaceTags(content.footer, values));
	} else {
		for (let value of values) {
			result = result.replace(new RegExp(value.tag, "g"), value.value);
		}
	}
	return result;
}

module.exports = function vote(time, channel, required,
	filter = () => { return true; },
	id = null,
	content = "A vote is required (<current>/<required>)!",
	user = null) {
	var result, vote;
	vote = running.find((other) => getScope(channel) == other.scope && other.id === id);
	if (id != null && vote != null) {
		if (vote.users == null)
			vote.users = new Collection();
		vote.users.set(user.id, user);
		result = null;
	} else {
		vote = {scope: getScope(channel), id: id};
		if (id != null)
			running.push(vote);

		result = new Promise((resolve, reject) => {
			try {
				channel.send(replaceTags(content, [{tag: "<current>", value: 0}, {tag: "<required>", value: required}])).then((message) => {
					message.react("👍").then((upVote) => {
						var finish, timeout;
						var getTally = () => {
							return upVote.users.filter((user) => { return filter(user); }).size - 1;
						};
						var updateMessage = (reaction) => {
							var tally = getTally();
							if (reaction.message.id === message.id)
								message.edit(replaceTags(content, [{tag: "<current>", value: tally}, {tag: "<required>", value: required}]));
							if (tally >= required)
								finish();
						};
						finish = () => {
							clearTimeout(timeout);
							channel.client.removeListener("messageReactionAdd", updateMessage);
							channel.client.removeListener("messageReactionRemove", updateMessage);
							if (id != null)
								running.splice(running.indexOf(running.find((other) => getScope(channel) == other.scope && other.id === id)), 1);
							resolve(getTally() > 0);
						};

						upVote = message.reactions.first();
						if (vote.users != null)
							vote.users.forEach((user) => upVote.users.set(user.id, user));
						vote.users = upVote.users;
						channel.client.on("messageReactionAdd", updateMessage);
						channel.client.on("messageReactionRemove", updateMessage);
						timeout = channel.client.setTimeout(finish, time);
					});
				});
			} catch(exc) {
				var voteIndex = running.indexOf(running.find((other) => getScope(channel) == other.scope && other.id === id));
				if (voteIndex >= 0)
					running.splice(voteIndex, 1);
				reject(exc);
			}
		});
	}
	return result;
}
