module.exports = {
	id: "delete",
	aliases: ["remove", "del"],
	run: (call) => {
		var role = call.params.readRole();
		if (role != null) {
			if (role.position < call.message.member.highestRole.position || call.message.guild.ownerID === call.message.author.id) {
				call.requestInput(0, "Are you sure you want to delete the `" + role.name + "` role? Respond `yes` or `no`.", 30000).then((response) => {
					if (response.params.readRaw().toLowerCase().startsWith("y")) {
						role.delete().then((deletedRole) => {
							response.message.reply("Deleted the `" + deletedRole.name + "` role.").catch(() => {});
						}).catch(() => {
							response.message.reply("Something went wrong while attempting to delete the `" + role.name + "` role.").catch(() => {
								call.message.author.send(`You attempted to run the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
							});
						});
					} else {
						response.message.reply("Cancelled prompt.").catch(() => {});
					}
				}).catch(() => {
					call.safeSend("You did not reply within 30 seconds. Prompt cancelled.");
				});
			} else call.safeSend("The role specified is too high up in this guild's role hierarchy to be deleted by you.");
		} else call.safeSend("Could not find the role you specified.");
	}
};
