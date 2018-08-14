const responses = {
	success: [
		"It is certain.",
		"It is decidedly so.",
		"Without a doubt.",
		"Yes - definitely.",
		"You may rely on it.",
		"As I see it, yes.",
		"Most likely.",
		"Outlook good.",
		"Yes.",
		"Signs point to yes."
	],
	retry: [
		"Reply hazy, try again.",
		"Ask again later.",
		"Better not tell you now.",
		"Cannot predict now.",
		"Concentrate and ask again."
	],
	fail: [
		"Don't count on it.",
		"My reply is no.",
		"My sources say no.",
		"Outlook not so good.",
		"Very doubtful."
	]
};

function filterText(text) {
	text = text.replace(require("@server/chat/filter.js").MARKDOWN_REGEX, "")
		.replace(/ +/g, "").toLowerCase();
	return text;
}

module.exports = {
	id: "8ball",
	aliases: ["eightball", "🎱"],
	description: "Replies with a random result to your question",
	paramsHelp: "(question)",
	params: [
		{
			type: "any",
			greedy: true,
			failure: "Please specify a question to ask the almighty 8ball 🎱.",
			required: true
		}
	],
	repeats: [],
	exec: function (call) {
		var question = call.parameters[0];
		var repeat = this.repeats.find((rep) => rep.question === filterText(question));
		var result;
		if (repeat != null) {
			result = repeat.result;
		} else {
			var keys = Object.keys(responses);
			var key = keys[Math.floor(Math.random() * keys.length)];
			result = responses[key][Math.floor(Math.random() * responses[key].length)];
			if (key !== "retry") {
				this.repeats.push({ question: filterText(question), result: result });
			}
		}
		call.safeSend(result + " 🎱");
	}
};
