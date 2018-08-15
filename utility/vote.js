const { Collection, GuildChannel, RichEmbed } = require("discord.js");
var running = [];

function getScope(channel) {
	return channel instanceof GuildChannel ? channel.guild.id : channel.id;
}

function replaceTags(content, values) {
	var result = content;
	if (content instanceof RichEmbed) {
		result.setTitle(replaceTags(content.title, values));
		result.setDescription(replaceTags(content.description, values));
		result.setFooter(replaceTags(content.footer.text, values));
		result.fields = result.fields.map((field) => {
			return { name: replaceTags(field.name, values), value: replaceTags(field.value, values), inline: field.inline };
		});
	} else {
		for (let value of values) {
			result = result.replace(new RegExp(value.tag, "g"), value.value);
		}
	}
	return result;
}

module.exports = function ({ time, channel, required,
	filter = () => { return true; },
	id = null,
	content = "A vote is required (<current>/<required>)!",
	user = null,
	updateIncrement = 1
}) {
	var result, vote;
	vote = running.find((other) => getScope(channel) == other.scope && other.id === id);
	if (id != null && vote != null) {
		if (vote.users == null)
			vote.users = new Collection();
		vote.users.set(user.id, user);
		result = null;
	} else {
		vote = { scope: getScope(channel), id: id };
		if (id != null)
			running.push(vote);

		result = new Promise((resolve, reject) => {
			try {
				channel.send(replaceTags(content, [{ tag: "<current>", value: 0 }, { tag: "<required>", value: required }])).then((message) => {
					message.react("👍").then(() => {
						var collector = message.createReactionCollector((r, u) => r.emoji.name === "👍" && filter(u),
							{ time, max: required + 1 });
						var onRemove = (reaction, user) => {
							if (reaction.message.id === message.id) {
								collector.total = reaction.count - (reaction.me ? 1 : 0);
								if (collector.total % updateIncrement === 0)
									message.edit(replaceTags(content, [{ tag: "<current>", value: collector.total }, { tag: "<required>", value: required }]));
								if (!collector.collected.some((r) => r.users.has(user.id)))
									collector.users.delete(user.id);
							}
						};

						collector.on("collect", (reaction) => {
							collector.total = reaction.count - (reaction.me ? 1 : 0);
							if (collector.total % updateIncrement === 0)
								message.edit(replaceTags(content, [{ tag: "<current>", value: collector.total }, { tag: "<required>", value: required }]));
						});

						message.client.on("messageReactionRemove", onRemove);

						collector.once("end", () => {
							message.client.removeListener("messageReactionRemove", onRemove);
							message.edit(replaceTags(content, [{ tag: "<current>", value: collector.total }, { tag: "<required>", value: required }]));
							resolve(required <= collector.total);
						});
					});
				});
			} catch (exc) {
				var voteIndex = running.indexOf(running.find((other) => getScope(channel) == other.scope && other.id === id));
				if (voteIndex >= 0)
					running.splice(voteIndex, 1);
				reject(exc);
			}
		});
	}
	return result;
};
