module.exports = {
	id: "create",
	aliases: ["add", "make"],
	run: (call) => {
		var args = call.params.readRaw().split(" ");
		if (args[0] != null) {
			var hexTag = null;
			if (args[0].startsWith("#")) hexTag = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(args[0]);
			hexTag = (!hexTag) ? null : args[0];
			var hoist = args[(hexTag == null) ? 0 : 1];
			if (["true", "false"].includes(hoist)) {
				hoist = (hoist === "true") ? [true, "set"] : [false, "set"];
			} else {
				hoist = [false, "auto"];
			}
			var amountToSubstr = 0;
			if (hoist[1] === "set") amountToSubstr += hoist[0].toString().length + 1;
			if (hexTag != null) amountToSubstr += hexTag.length + 1;
			var name = args.join(" ").substr(amountToSubstr);
			if (name !== "" && name.length < 100) {
				call.message.guild.createRole({ name: name, color: hexTag, hoist: hoist[0] }).then((role) => {
					call.message
						.reply(`Successfully created the role \`${role.name}\` with \`${role.hoist}\` hoist and \`${(role.hexColor !== "#0000000") ? role.hexColor : "no"}\` color.`)
						.catch(() => {});
				}).catch(() => {
					call.message.reply("There was an error upon attempting to make that role.").catch(() => {
						call.message.author.send(`You attempted to run the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
					});
				});
			} else {
				call.message.reply("The role name given is either non-existant or has more than 100 characters.").catch(() => {
					call.message.author.send(`You attempted to run the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
				});
			}
		} else {
			call.message.reply("Please specify the following params [optional] (required). `!role create [hexcolor: #XXXXXX] [hoist: true/false] (role name)`.").catch(() => {
				call.message.author.send(`You attempted to run the \`role\` command in ${call.message.channel}, but I can not chat there.`).catch(() => {});
			});
		}
	}
};
