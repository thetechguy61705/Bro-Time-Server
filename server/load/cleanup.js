module.exports = {
	id: "cleanup",
	exec: (client) => {
		// Force stop typing after 10 seconds if typing.
		client.on("typingStart", (channel, user) => {
			client.setTimeout(() => {
				if (user.id === client.user.id && user.typingDurationIn() >= 10000) channel.stopTyping();
			}, 10000);
		});

		// Leaves VoiceChannel if alone in VoiceChannel for 10 seconds.
		client.on("voiceStateUpdate", (oldMember, newMember) => {
			var voiceChannel;
			if (oldMember.voiceChannel &&
				oldMember.voiceChannel.members.find((mem) => !mem.user.bot) == null &&
				oldMember.voiceChannel.members.has(client.user.id)) {
				voiceChannel = oldMember.voiceChannel;
				client.setTimeout(() => {
					if (voiceChannel &&
							voiceChannel.members.find((mem) => !mem.user.bot) == null &&
							voiceChannel.members.has(client.user.id)) {
						if (voiceChannel.dispatcher) oldMember.voiceChannel.dispatcher.end();
						voiceChannel.leave();
					}
				}, 10000);
			} else if (newMember.voiceChannel &&
				newMember.user.bot &&
				newMember.voiceChannel.members.find((mem) => !mem.user.bot) == null &&
				newMember.voiceChannel.members.has(client.user.id)) {
				voiceChannel = newMember.voiceChannel;
				client.setTimeout(() => {
					if (voiceChannel &&
							voiceChannel.members.find((mem) => !mem.user.bot) == null &&
							voiceChannel.members.has(client.user.id)) {
						if (voiceChannel.dispatcher) voiceChannel.dispatcher.end();
						voiceChannel.leave();
					}
				}, 10000);
			}
		});
	}
};
