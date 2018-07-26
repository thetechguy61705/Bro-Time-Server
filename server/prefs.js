module.exports = {
	musicFilterExcplicit: {
		type: "boolean",
		default: true
	},
	musicFilterRated: {
		type: "boolean",
		default: false
	},
	musicFilterLoud: {
		type: "boolean",
		default: false
	},
	musicDJS: {
		type: "bigint[]",
		default: []
	},
	musicDisabledChannels: {
		type: "bigint[]",
		default: []
	},
	mods: {
		type: "bigInt[]",
		default: []
	},
	filtered: {
		type: "varchar[]",
		default: []
	},
	logTypes: {
		type: "varchar[]",
		default: [
			"CHANNEL_CREATE",
			"CHANNEL_UPDATE",
			"CHANNEL_DELETE",
			"ROLE_CREATE",
			"ROLE_UPDATE",
			"ROLE_DELETE",
			"EMOJI_CREATE",
			"EMOJI_UPDATE",
			"EMOJI_DELETE",
			"MEMBER_BAN_ADD",
			"MEMBER_BAN_REMOVE",
			"MESSAGE_DELETE",
			"MESSAGE_UPDATE",
			"MESSAGE_DELETE_BULK"
		]
	},
	inviteFilter: {
		type: "boolean",
		default: false
	},
	muteRole: {
		type: "bigint",
		default: 123
	},
	disabledCmdsGlobal: [
		{ type: "varchar[]", default: [] },
		{ type: "bigint[]", default: [] }
	],
	disabledCmdsChannel: [
		{ type: "varchar[]", default: [] },
		{ type: "bigint[]", default: [] }
	],
	disableCategoryGlobal: [
		{ type: "varchar[]", default: [] },
		{ type: "bigint[]", default: [] }
	],
	disableCategoryChannel: [
		{ type: "varchar[]", default: [] },
		{ type: "bigint[]", default: [] }
	]
};
