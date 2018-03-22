module.exports = {
	id: "freerole",
	load: () => {},
	execute: (call) => {
		var choice = call.params.readRaw();
		if(!choice) || (choice.toLowerCase() === "computer") {
			call.message.channel.send("\`\`\`__Bro Time__ \nWant to join a **fun**, **engaging** community? Do you enjoy participating in **giveaways**, posting **memes**, creating **stories**, talking with other **developers**, Playing **games** with bots, listening to **music**, joining **game nights**, or answering **QOTDs**? \nThen You Should **Join The Community Today!** \nhttps://discord.gg/rjM8wdZ\`\`\`");
		}
		if(choice.toLowerCase() === "mobile") {
			call.message.channel.send("__Bro Time__ \nWant to join a **fun**, **engaging** community? Do you enjoy participating in **giveaways**, posting **memes**, creating **stories**, talking with other **developers**, Playing **games** with bots, listening to **music**, joining **game nights**, or answering **QOTDs**? \nThen You Should **Join The Community Today!** \nhttps://discord.gg/rjM8wdZ");
		}
	}
};


