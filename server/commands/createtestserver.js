// eslint-disable-next-line no-unused-vars
function reverse(str){
	return str.split("").reverse().join("");
}

module.exports = {
	id: "createtestserver",
	load: () => {},
	execute: (call) => {
		if (call.message.author.id != "289380085025472523") return;
		var testGuild = call.client.guilds.get("430096406275948554");
		var realGuild = call.client.guilds.get("330913265573953536");
		var count = 0;
		testGuild.roles.forEach(function(role) {
			role.delete().then(() => {
				count = count+1;
				if (count == testGuild.roles.size) {
					count = 0;
					testGuild.channels.forEach(function(channel) {
						channel.delete().then(() => {
							count = count+1;
							if (count == testGuild.channels.size) {
								count = 0;
								realGuild.roles.forEach(function(role) {
									var permissions = role.permissions.map(function() {
										testGuild.createRole({
											name: role.name,
											color: role.color,
											hoist: role.hoist,
											position: role.position,
											mentionable: role.mentionable,
										}).then(() => {
											count = count+1;
											if (count == realGuild.roles.size) {
												count = 0;
												var textChannels = realGuild.channels.filter(channel => channel.type === "text");
												textChannels.forEach(function(channel) {
													var permissions = channel.permissionOverwrites.map(function() {
														perm => perm.serialize();
													});
													testGuild.createChannel(channel.name, "text", permissions).then(() => {
														count = count+1;
														if (count == textChannels.size) {
															count = 0;
															var voiceChannels = realGuild.channels.filter(channel => channel.type === "voice");
															voiceChannels.forEach(function(voiceChannel) {
																permissions = voiceChannel.permissionOverwrites.map(function() {
																	perm => perm.serialize();
																});
																testGuild.createChannel(channel.name, "voice", permissions).then(() => {
																	count = count+1;
																	if (count == voiceChannels.size) {
																		count = 0;
																		var categoryChannels = realGuild.channels.filter(channel => channel.type === "category");
																		categoryChannels.forEach(function(categoryChannel) {
																			permissions = categoryChannel.permissionOverwrites.map(function() {
																				perm => perm.serialize();
																			});
																			testGuild.createChannel(channel.name, "category", permissions).then(() => {
																				count = count+1;
																				if (count == categoryChannels.size) {
																					count = 0;
																					var allChannels = realGuild.channels;
																					allChannels.forEach(function(allChannel) {
																						var parent = allChannel.parent.name;
																						var testChannel = testGuild.channels.find("name", allChannel.name);
																						var testCategoryChannel = testGuild.channels.find("name", parent);
																						testChannel.setParent(testCategoryChannel);
																					});
																				}
																			});
																		});
																	}
																});
															});
														}
													});
												});
											}
										});
									});
								});
							}
						});
					});
				}
			});
		});
	}
};
