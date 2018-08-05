const fetch = require("node-fetch");
const apiURI = "http://api.roblox.com/";
const { Collection } = require("discord.js");
const flatten = require("array-flatten");

async function group(groupID) {
	var info = await fetch(apiURI + `groups/${groupID}`);
	info = await info.json();
	if (info.code && info.message) throw new Error(`${info.code}: ${info.message}`);
	return new RobloxGroup(info);
}

async function user(userID) {
	var info = await fetch(apiURI + `users/${userID}`);
	info = await info.json();
	if (info.errors) throw new Error(`${info.errors[0].code}: ${info.errors[0].message}`);
	return new RobloxUser(info);
}

class RobloxPlace {
	constructor(info) {
		this.name = info.Name;
		this.visits = info.Plays;
		this.creatorName = info.CreatorName;
		this.price = info.Price;
		this.votingEnabled = info.IsVotingEnabled;
		this.upvotes = info.TotalUpVotes;
		this.downvotes = info.TotalDownVotes;
		this.purchases = info.TotalBought;
		this.desc = info.Description;
		this.favorites = info.Favorites;
		this.thumbnailURL = info.Thumbnail.Url;
		this.currentPlayerCount = info.PlayerCount;
		this.id = info.PlaceID;
	}
}

class RobloxGroupRole {
	constructor(info) {
		this.name = info.Name;
		this.position = info.Rank;
	}
}

class RobloxGroup {
	constructor(info) {
		this.name = info.Name;
		this.id = info.Id;
		if (info.Owner) this.ownerName = info.Owner.Name;
		if (info.Owner) this.ownerID = info.Owner.Id;
		this.desc = info.Description;
		this.roles = info.Roles.map((role) => new RobloxGroupRole(role));
	}

	async getAllies() {
		var allies = await fetch(apiURI + `groups/${this.id}/allies`);
		allies = await allies.json();
		if (allies.code && allies.message) throw new Error(`${allies.code}: ${allies.message}`);
		return new Collection(allies.Groups.map((g) => [g.Id, new RobloxGroup(g.Id)]));
	}

	async getEnemies() {
		var enemies = await fetch(apiURI + `groups/${this.id}/enemies`);
		enemies = await enemies.json();
		if (enemies.code && enemies.message) throw new Error(`${enemies.code}: ${enemies.message}`);
		return new Collection(enemies.Groups.map((g) => [g.Id, new RobloxGroup(g.Id)]));
	}

	async getThumbnailURL() {
		var thumbnail = await fetch(`https://www.roblox.com/group-thumbnails?params=%5B%7BgroupId:${this.id}%7D%5D`);
		thumbnail = await thumbnail.json();
		return thumbnail[0].thumbnailUrl;
	}

	async getRoleOf(userID) {
		var groups = await fetch(apiURI + `users/${userID}/groups`);
		groups = await groups.json();
		if (groups.errors) throw new Error(`${groups.errors[0].code}: ${groups.errors[0].message}`);
		var thisGroup = groups.find((g) => g.Id === this.id);
		if (thisGroup != null) {
			return new RobloxGroupRole({ Rank: thisGroup.Rank, Name: thisGroup.Role });
		} else throw new Error("User is not in this group.");
	}
}

class RobloxUser {
	constructor(info) {
		this.id = info.Id;
		this.username = info.Username;
	}

	async getFriends() {
		var friends = [];
		for (let i = 1; i < 5; i++) {
			friends.push(fetch(apiURI + `users/${this.id}/friends?page=${i}`).then((res) => res.json()));
		}
		friends = await Promise.all(friends);
		var err = friends.find((friend) => friend.errors);
		if (err) throw new Error(`${err.errors[0].code}: ${err.errors[0].message}`);
		friends = await Promise.all(flatten(friends).map((friend) => user(friend.Id)));
		return new Collection(friends.map((friend) => [friend.id, friend]));
	}

	async getGames() {
		var games = await fetch(`https://www.roblox.com/users/profile/playergames-json?userId=${this.id}`);
		games = await games.json();
		return new Collection(games.Games.map((game) => [game.PlaceID, new RobloxPlace(game)]));
	}

	async getMembership() {
		var membership = await fetch(`http://www.roblox.com/Thumbs/BCOverlay.ashx?username=${this.username}`);
		membership = membership.url.match(/overlay_((o|t)?bc)Only/);
		if (membership) return membership[1].toUpperCase();
		return "NBC";
	}

	async getAvatarURL() {
		var avatar = await fetch(`https://www.roblox.com/bust-thumbnail/image?userId=${this.id}&width=420&height=420&format=png`);
		if (!avatar.url.includes("t4.rbxcdn.com")) throw new Error("Bad Request");
		return avatar.url;
	}

	async getPreviousUsernames(includeCurrent = false) {
		if (![true, false].includes(includeCurrent)) throw new TypeError("IncludeCurrent must be a boolean.");
		var usernames = await fetch(`https://newstargeted.com/api/roblox/Users/Usernames?userId=${this.id}`);
		usernames = await usernames.json();
		if (includeCurrent) usernames[0] = this.username;
		return usernames.slice(!includeCurrent);
	}

	async getPrimaryGroup() {
		var primaryGroup = await fetch(`https://www.roblox.com/Groups/GetPrimaryGroupInfo.ashx?users=${this.username}`);
		primaryGroup = await primaryGroup.json();
		if (primaryGroup[this.username]) {
			return await group(primaryGroup[this.username].GroupId);
		} else return null;
	}

	async getGroups() {
		var groups = await fetch(apiURI + `users/${this.id}/groups`);
		groups = await groups.json();
		if (groups.errors) throw new Error(`${groups.errors[0].code}: ${groups.errors[0].message}`);
		groups = await Promise.all(groups.map((g) => group(g.Id)));
		return new Collection(groups.map((g) => [g.id, g]));
	}

	async canManageAsset(assetID) {
		var can = await fetch(apiURI + `users/${this.id}/canmanage/${assetID}`);
		can = await can.json();
		if (can.errors) throw new Error(`${can.errors[0].code}: ${can.errors[0].message}`);
		return can.CanManage;
	}

	async ownsAsset(assetID) {
		var owns = await fetch(apiURI + `ownership/hasasset?userId=${this.id}&assetId=${assetID}`);
		owns = await owns.json();
		if (owns.code && owns.message) throw new Error(`${owns.code}: ${owns.message}`);
		return owns;
	}

	async inGroup(groupID) {
		var isIn = await fetch(`https://assetgame.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=IsInGroup&playerid=${this.id}&groupid=${groupID}`);
		isIn = await isIn.text();
		if (!/>(true|false)</.test(isIn)) throw new Error(isIn);
		return isIn.match(/>(true|false)</)[1].toBoolean();
	}

	async isFriendsWith(userID) {
		var friendsWith = await fetch(`https://assetgame.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=IsFriendsWith&playerId=${this.id}&userId=${userID}`);
		friendsWith = await friendsWith.text();
		if (!/>(true|false)</.test(friendsWith)) throw new Error(friendsWith);
		return friendsWith.match(/>(true|false)</)[1].toBoolean();
	}
}

module.exports = {
	fetchGroup: group,
	fetchUser: user,
	getUsernameByID: async function (userID) {
		var user = await this.fetchUser(userID);
		return user.username;
	},
	getIDByUsername: async function(username) {
		var user = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`);
		user = await user.json();
		if (user.success) {
			return user.id;
		} else throw new Error(user.errorMessage);
	},
	usernameOwned: async function(username) {
		var taken = await fetch(`http://www.roblox.com/UserCheck/DoesUsernameExist?username=${username}`);
		taken = await taken.json();
		return taken.success;
	}
};
