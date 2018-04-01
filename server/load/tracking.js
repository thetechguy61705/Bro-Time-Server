/*var ua = require("universal-analytics");
var { Collection } = require("discord.js");

module.exports = {
	exec: (client, settings) => {
		var visitors = new Collection();
		function getVisit(id) {
			return visitors.get(id) || ua(settings.TRACKING, {
				https: true,
				ds: client.user.username,
				uid: id
			}).debug(process.env.NODE_ENV !== "production");
		}

		client.on("guildMemberAdd", (member) => {
			visitors.set(member.id, getVisit(member.id));
		});
		client.on("guildMemberRemove", (member) => {
			visitors.delete(member.id);
		});
		client.on("guildDelete", (guild) => {
			visitors.forEach((visit) => {
				if (visit.guild === guild)
					visitors.delete(visit);
			});
		});

		client.on("message", (message) => {
			getVisit(message.author.id).event("Message", "Post", message.guild.name, 0, {qt: Math.max(message.createdTimestamp - Date.now(), 0)});
		});
		client.on("messageDelete", (message) => {
			getVisit(message.author.id).event("Message", "Delete", message.guild.name, 0, {qt: Math.max(message.createdTimestamp - Date.now(), 0)});
		});
		client.on("presenceUpdate", (oldMember, newMember) => {
			if (oldMember.presence.status !== newMember.presence.status)
				getVisit(newMember.id).event("Presence", "Status Changed", newMember.presence.status);
		});
	}
};
*/
