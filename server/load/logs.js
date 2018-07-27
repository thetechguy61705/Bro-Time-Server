const { RichEmbed, Role, GuildChannel } = require("discord.js");

const GREEN_HEX = "#00FF7F";
const ORANGE_HEX = "#FFA500";
const RED_HEX = "#FF4500";

module.exports = {
	id: "logging",
	getChannel: (guild) => {
		var result;
		var channel = guild.channels.find((channel) => (channel.name === "logs" && !(channel.topic || "").includes("<no-log>")) || (channel.topic || "").includes("<bro-bot-log>"));
		if (channel != null) {
			var transferred = (channel.topic || "").match(/<transfer:\d+>/);
			if (transferred != null) {
				transferred = transferred[0].match(/\d+/);
				if (transferred != null) transferred = transferred[0];
				var receivingGuild = guild.client.guilds.get(transferred);
				if (receivingGuild != null) {
					result = receivingGuild.channels.find((c) => {
						var received = (c.topic || "").match(/<receive:\d+>/);
						if (received != null) received = received[0].match(/\d+/);
						if (received != null) received = received[0];
						if (guild.id === received) return true;
					});
				}
			} else result = channel;
		}
		return result;
	},
	objectsEqual: (obj, obj2) => {
		var overwrites = obj instanceof Role ? { equals: (val) => { return obj.permissions === val; } } : obj.permissionOverwrites;
		var overwrites2 = obj instanceof Role ? obj2.permissions : obj2.permissionOverwrites;
		return obj.id === obj2.id &&
			obj.type === obj2.type &&
			obj.topic === obj2.topic &&
			obj.name === obj2.name &&
			obj.hoisted === obj2.hoisted &&
			obj.mentionable === obj2.mentionable &&
			obj.color === obj2.color &&
			overwrites.equals(overwrites2);
	},
	getExecutor: async function (guild, type) {
		var audit = await guild.fetchAuditLogs({ type: type, limit: 1 });
		return audit.entries.first().executor;
	},
	exec: function (client) {
		client.on("raw", async (packet) => {
			if (packet.t === "MESSAGE_UPDATE") {
				let channel = client.channels.get(packet.d.channel_id);
				if (channel && !channel.messages.has(packet.d.id)) {
					channel.fetchMessage(packet.d.id);
				}
			} else if (packet.t === "MESSAGE_DELETE_BULK") {
				client.emit("rawMessageDeleteBulk", packet.d.ids, client.channels.get(packet.d.channel_id));
			}
		});

		client.on("channelCreate", async (channel) => {
			if (channel instanceof GuildChannel) {
				let executor = await this.getExecutor(channel.guild, "CHANNEL_CREATE");
				let logs = this.getChannel(channel.guild);
				if (logs) logs.send(
					new RichEmbed()
						.setAuthor(executor.tag, executor.displayAvatarURL)
						.setTitle("Channel Created")
						.setDescription(`Name: \`${channel.name}\`\nID: \`${channel.id}\`\nType: \`${channel.type}\``)
						.setColor(GREEN_HEX)
				);
			}
		});

		client.on("channelDelete", async (channel) => {
			if (channel instanceof GuildChannel) {
				let executor = await this.getExecutor(channel.guild, "CHANNEL_DELETE");
				let logs = this.getChannel(channel.guild);
				if (logs) logs.send(
					new RichEmbed()
						.setAuthor(executor.tag, executor.displayAvatarURL)
						.setTitle("Channel Deleted")
						.setDescription(`Name: \`${channel.name}\`\nID: \`${channel.id}\`\nType: \`${channel.type}\``)
						.setColor(RED_HEX)
				);
			}
		});

		client.on("channelUpdate", async (oldChannel, newChannel) => {
			if (!["group", "dm"].includes(newChannel.type) && !this.objectsEqual(oldChannel, newChannel)) {
				let executor = await this.getExecutor(newChannel.guild, "CHANNEL_UPDATE");
				let logs = this.getChannel(newChannel.guild);
				if (logs) logs.send(
					new RichEmbed()
						.setAuthor(executor.tag, executor.displayAvatarURL)
						.setTitle("Channel Updated")
						.setDescription(`Name: \`${oldChannel.name}\` --> \`${newChannel.name}\`\nType: \`${newChannel.type}\``)
						.addField("Changed", `Name: \`${oldChannel.name !== newChannel.name}\`\n` +
							`Overwrites: \`${!oldChannel.permissionOverwrites.equals(newChannel.permissionOverwrites)}\`\n` +
							`Position: \`${oldChannel.position !== newChannel.position}\`\n` +
							`Parent: \`${oldChannel.parentID !== newChannel.parentID}\`\n` +
							`Topic: \`${oldChannel.topic !== newChannel.topic}\``)
						.setColor(ORANGE_HEX)
				);
			}
		});

		client.on("emojiCreate", async (emoji) => {
			let executor = await this.getExecutor(emoji.guild, "EMOJI_CREATE");
			let logs = this.getChannel(emoji.guild);
			if (logs) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Emoji Created")
					.setDescription(`Name: \`${emoji.name}\`\nID: \`${emoji.id}\`\nFormatted: \`${emoji}\``)
					.setColor(GREEN_HEX)
			);
		});

		client.on("emojiDelete", async (emoji) => {
			let executor = await this.getExecutor(emoji.guild, "EMOJI_DELETE");
			let logs = this.getChannel(emoji.guild);
			if (logs) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Emoji Deleted")
					.setDescription(`Name: \`${emoji.name}\`\nID: \`${emoji.id}\``)
					.setColor(RED_HEX)
			);
		});

		client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
			let executor = await this.getExecutor(newEmoji.guild, "EMOJI_UPDATE");
			let logs = this.getChannel(newEmoji.guild);
			if (logs) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Emoji Updated")
					.setDescription(`Name: \`${oldEmoji.name}\` --> \`${newEmoji.name}\``)
					.addField("Changed", `Name: \`${oldEmoji.name !== newEmoji.name}\`\n` +
						`Roles: \`${!oldEmoji.roles.equals(newEmoji.roles)}\`\n` +
						`Needs Colons: \`${oldEmoji.requiresColons !== newEmoji.requiresColons}\`\n` +
						`Managed: \`${oldEmoji.managed !== newEmoji.managed}\``)
					.setColor(ORANGE_HEX)
			);
		});

		client.on("guildBanAdd", async (guild, user) => {
			let executor = await this.getExecutor(guild, "MEMBER_BAN_ADD");
			let logs = this.getChannel(guild);
			if (logs) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Member Banned")
					.setDescription(`User: \`${user.tag}\`\nUser ID: \`${user.id}\``)
					.setColor(RED_HEX)
			);
		});

		client.on("guildBanRemove", async (guild, user) => {
			let executor = await this.getExecutor(guild, "MEMBER_BAN_REMOVE");
			let logs = this.getChannel(guild);
			if (logs) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Member Unbanned")
					.setDescription(`User: \`${user.tag}\`\nUser ID: \`${user.id}\``)
					.setColor(GREEN_HEX)
			);
		});

		client.on("roleCreate", async (role) => {
			let executor = await this.getExecutor(role.guild, "ROLE_CREATE");
			let logs = this.getChannel(role.guild);
			if (logs) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Role Created")
					.setDescription(`Name: \`${role.name}\`\nID: \`${role.id}\`\nColor: \`${role.hexColor}\``)
					.setColor(GREEN_HEX)
			);
		});

		client.on("roleDelete", async (role) => {
			let executor = await this.getExecutor(role.guild, "ROLE_DELETE");
			let logs = this.getChannel(role.guild);
			if (logs) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Role Deleted")
					.setDescription(`Name: \`${role.name}\`\nID: \`${role.id}\`\nColor: \`${role.hexColor}\``)
					.setColor(RED_HEX)
			);
		});

		client.on("roleUpdate", async (oldRole, newRole) => {
			let executor = await this.getExecutor(newRole.guild, "ROLE_UPDATE");
			let logs = this.getChannel(newRole.guild);
			if (logs && !this.objectsEqual(oldRole, newRole) && !/(rainbow(role)?)|(multicolou?r(ed)?)/i.test(newRole.name)) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Role Updated")
					.setDescription(`Name: \`${oldRole.name}\` --> \`${newRole.name}\`\nColor: \`${oldRole.hexColor}\` --> \`${newRole.hexColor}\``)
					.addField("Changed", `Name: \`${oldRole.name !== newRole.name}\`\n` +
						`Mentionable: \`${oldRole.mentionable !== newRole.mentionable}\`\n` +
						`Hoisted: \`${oldRole.hoist !== newRole.hoist}\`\n` +
						`Color: \`${oldRole.color !== newRole.color}\`\n` +
						`Position: \`${oldRole.position !== newRole.position}\`\n` +
						`Permissions: \`${oldRole.permissions !== newRole.permissions}\``)
					.setColor(ORANGE_HEX)
			);
		});

		client.on("messageUpdate", (oldMessage, newMessage) => {
			let executor = newMessage.author;
			let logs = this.getChannel(newMessage.guild);
			if (logs && oldMessage.content !== newMessage.content) logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Message Updated")
					.setDescription(`ID: \`${newMessage.id}\`\nDate: \`${newMessage.editedAt.toString().substring(0, 15)}\``)
					.addField("Old Content", `\`\`\`md\n${oldMessage.content.substring(0, 1014)}\`\`\``)
					.addField("New Content", `\`\`\`md\n${newMessage.content.substring(0, 1014)}\`\`\``)
					.setColor(ORANGE_HEX)
			);
		});

		client.on("messageDelete", (message) => {
			let executor = message.author;
			let logs = this.getChannel(message.guild);
			if (logs && message.content !== "") logs.send(
				new RichEmbed()
					.setAuthor(executor.tag, executor.displayAvatarURL)
					.setTitle("Message Deleted")
					.setDescription(`ID: \`${message.id}\``)
					.addField("Content", `\`\`\`md\n${message.content.substring(0, 1014)}\`\`\``)
					.setColor(RED_HEX)
			);
		});

		client.on("rawMessageDeleteBulk", (messageIDS, channel) => {
			let logs = this.getChannel(channel.guild);
			if (logs) logs.send(
				new RichEmbed()
					.setTitle("Bulk Messages Deleted")
					.setDescription(`Size: \`${messageIDS.length}\`\nIDs: \`${messageIDS.join("`, `").substring(0, 2020)}\``)
					.setColor(RED_HEX)
			);
		});
		// Self emitted event to handle emitting non-cached bulk deletes.
	}
};
