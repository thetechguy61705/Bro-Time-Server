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
	muteRole: {
		type: "bigint",
		default: 133
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
