module.exports = {
	id: "color",
	load: () => {},
	execute: (call) => {
		if(call.client.multicolor) {
			call.client.multicolor = false
			var ha = "off"
		} else {
			call.client.multicolor = true
			var ha = "on"
			}
		call.message.channel.send(`Switched ${ha}`).catch(() => {
			call.message.author.send(`You attempted to run the \`color\` command in ${call.message.channel}, but I do not have permission to chat there.`)
				.catch(function(){});
		});
	}
};
