/**
* Number 1 - 10 for non-premium users, 1 - 20 for premium users.
* 30% chance of not gaining Bro Bits.
* Use every 10 minutes.
*/

var premium = require("@utility/premium");
const FAILURE_MESSAGES = [
	"You tripped over a rock and broke your leg.",
	"You got knocked by a sticky bomb and your teammates were laughing too hard to res you.",
	"In an attempt to scale the staircase to heaven you tripped and fell to your death.",
	"After scrounging around for hours, you find no Bro Bits.",
	"You thought a penny was a Bro Bit and cried for the rest of the day.",
	"A thief took the Bro Bits you collected.",
	"A Pikachu ate your Bro Bits that you collected.",
	"Harry Potter vaporized your Bro Bits that you collected.",
	"A John Wick killed you and took your Bro Bits that you collected.",
	"You saw a dead meme and could go no further with your day.",
	"A Roblox ODer invited you to a date and snatched your Bro Bits while you were laughing.",
	"You nearly died from dehydration, but bought some water using the Bro Bits you collected to survive.",
	"You dropped all your Bro Bits that you collected from laughing at how lifeless the person who wrote all these failure messages must be.",
	"Shedletsky killspawned you in SFOH.",
	"Minecraft."
];
const COOLDOWN_TIME = 600000;
// 10 minutes.
function randomReject() {
	return FAILURE_MESSAGES[Math.floor(Math.random() * FAILURE_MESSAGES.length)];
}

function rateLimitUser(call) {
	var remindOption = ["remindme", "timer", "t", "true"].includes(call.params.readParam());
	module.exports.rateLimit.push(call.message.author.id);
	call.client.setTimeout(() => {
		module.exports.rateLimit.splice(module.exports.rateLimit.indexOf(call.message.author.id), 1);
		if (remindOption) call.message.author.send("You can loot Bro Bits again!");
	}, COOLDOWN_TIME);
}

module.exports = {
	id: "loot",
	description: "Gives you a random amount of Bro Bits.",
	rateLimit: [],
	access: "Public",
	exec: (call) => {
		if (module.exports.rateLimit.indexOf(call.message.author.id) === -1) {
			var randomSuccess = ((Math.random() * 10) > 3) ? true : false;
			var multiplier = (premium(call.message.author)) ? 20 : 10;
			var randomBits = Math.ceil(Math.random() * multiplier);
			if (randomSuccess) {
				call.getWallet(call.message.author.id).change(randomBits).then(() => {
					call.message.reply("You looted " + randomBits + " Bro Bits!");
					rateLimitUser(call);
				}).catch(() => { call.safeSend("Failed to give you Bro Bits."); });
			} else {
				call.safeSend(randomReject() + " Wait 10 minutes before attempting to loot again.");
				rateLimitUser(call);
			}
		} else call.safeSend("You must wait 10 minutes from the last time you used the command.");
	}
};
