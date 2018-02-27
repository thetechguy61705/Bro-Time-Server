async function aR(message, question, limit = 60000){
	const filter = m => m.author.id === message.author.id;
	await message.channel.send(question);
	try {
		const collected = await message.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
		return collected.first().content;
	} catch (error) {
		return false;
	}
}

async function makerole(message, digit) {
	const n = await aR(message, "Please specify the name of your role.", 60000);
	if (n == "cancel") return message.channel.send("**Cancelled Prompt.**");
	if (n.length > 62) {
		message.channel.send("Length of role is too long. Max length is 62 characters");
	} else {
		const c = await aR(message, "Please specify the hex color of your role.", 60000);
		if (c == "cancel") return message.channel.send("**Cancelled Prompt.**");
		var color = c;
		var ishex  = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(`${c}`);
		var ishextag = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(`${c}`);
		if (ishex == true||ishextag == true) {
			if (ishex) {
				color = "#"+color;
			}
			message.guild.createRole({
				name: `${digit}${message.author.id} ${n}`,
				color: color,
			}).then(() => {
				let rolename = `${digit}${message.author.id} ${n}`;
				let role = message.guild.roles.find(r=> r.name.toLowerCase() === rolename.toLowerCase());
				let goldpos = message.guild.roles.find("name", "Gold").position;
				message.guild.setRolePosition(role, goldpos+1, false);
				message.member.removeRole(message.guild.roles.find("name", `${digit}`));
				message.member.addRole(role);
				message.channel
					.send(`Successfully created the role! To remove the role say \`/customcolor remove ${digit}\``);
			}).catch(() => {
				message.channel.send("🤖 Something went wrong and I could not make the role! 🤖");
			});
		} else {
			message.channel.send("Invalid hex code. Hex code example `#ff0000`.");
		}
	}
}

async function deleterole(message) {
	const dc = await aR(message, "Which color role do you want to remove (first digit of role name)?", 60000);
	if (dc == "cancel") return message.channel.send("**Canceled Prompt.**");
	if (!isNaN(dc)) {
		if (dc <= 5 && dc >= 1) {
			const n = await aR(message, "What is the custom role name?", 60000);
			if (n == "cancel") return message.channel.send("**Canceled Prompt.**");
			let rolename = `${dc}${message.author.id} ${n}`;
			if (message.guild.roles.find("name", rolename)) {
				const yesno = await aR(message, "Are you sure you want to delete this custom role?", 60000);
				if (yesno == "cancel") return message.channel.send("**Canceled Prompt.**");
				if (yesno.toLowerCase() == "yes") {
					let role = message.guild.roles.find(r=> r.name.toLowerCase() === rolename.toLowerCase());
					role.delete();
					let role1 = message.guild.roles.find("name", `${dc}`);
					message.member.addRole(role1);
					message.channel
						.send(`Successfully deleted the custom color role! \`${rolename}\``);
				} else {
					message.channel.send("Assuming you didn't mean to say yes, I cancelled the prompt.");
				}
			} else {
				message.channel.send("Could not find that role.");
			}
		} else {
			message.channel.send(`\`${dc} \` must be a number between 1 - 5.`);
		}
	} else {
		message.channel.send(`\`${dc} \` is not a number.`);
	}
}

module.exports = {
	id: "customcolor",
	load: () => {},
	execute: async (call) => {
		var input1 = call.params.readRaw().toLowerCase();
		const c = await aR(call.message, "Would you like to create a custom color role, or delete one?", 60000);
		var choice = c.toLowerCase();
		if (choice == "cancel") return call.message.channel.send("**Canceled Prompt.**");
		if (choice=="create"||choice=="add"||choice=="make") {
			if (call.message.member.roles.find("name", "1")) {
				makerole(call.message, 1);
			} else if (call.message.member.roles.find("name", "2")) {
				makerole(call.message, 2);
			} else if (call.message.member.roles.find("name", "3")) {
				makerole(call.message, 3);
			} else if (call.message.member.roles.find("name", "4")) {
				makerole(call.message, 4);
			} else if (call.message.member.roles.find("name", "5")) {
				makerole(call.message, 5);
			} else {
				call.message.channel.send("You do not have any remaining custom roles.");
			}
		} else if (choice=="remove"||choice=="rem"||input1=="delete"||input1=="del") {
			deleterole(call.message);
		}
	}
};
