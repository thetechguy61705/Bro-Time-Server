import { ICommand, Call } from "@server/chat/commands";
import { DataRequest } from "@utility/datarequest.ts";

module.exports = <ICommand>{
	id: "roundtrip",
	test: true,
	execute: (call: Call) => {
		DataRequest.doRoundTrip(call.params.readParam() === "true").then(() => {
			call.message.channel.send("Round trip finished.");
		}, (error: Error) => {
			call.message.channel.send(`Round trip failed: ${error.message}.`);
		});
	}
};
