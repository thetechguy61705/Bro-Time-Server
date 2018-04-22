module.exports = {
	id: "color",
	load: () => {},
	execute: (call) => {
		if(call.message.member.hasPermission("MANAGE_ROLES")) {
			var ha;
			if(call.client.multicolor) {
				call.client.multicolor = false;
				ha = "off";
			} else {
				call.client.multicolor = true;
				ha = "on";
			}
			call.message.channel.send(`Switched ${ha}`).catch(() => {
				call.message.author.send(`You attempted to run the \`color\` command in ${call.message.channel}, but I do not have permission to chat there.`)
					.catch(function(){});
			});
		}
	}
};
