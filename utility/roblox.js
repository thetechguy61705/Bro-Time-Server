const fetch = require("node-fetch");
const apiURI = "http://api.roblox.com/";
const { Collection } = require("discord.js");
const flatten = require("array-flatten");

function decodeHtmlEntity(str) {
	return str.replace(/&#(\d+);/g, (match, dec) => {
		return String.fromCharCode(dec);
	});
}

async function group(groupID) {
	var info = await fetch(`https://groups.roblox.com/v1/groups/${groupID}`).then((res) => res.json());
	if (info.errors && info.errors[0]) throw new Error(`${info.errors[0].code}: ${info.errors[0].message}`);
	return new RobloxGroup(info);
}

async function user(user) {
	var info = await fetch(apiURI + `users/${/^\d+$/.test(user) ? "" : "get-by-username?username="}${user}`).then((res) => res.json());
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
	constructor(info, groupID) {
		this.name = info.Name;
		this.position = info.Rank;
		this.groupID = groupID;
	}

	getGroup() {
		return group(this.groupID);
	}
}

class RobloxGroupShout {
	constructor(info, groupID) {
		this.value = info.body;
		this.authorID = info.poster.id;
		this.groupID = groupID;
		this.createdAt = new Date(info.created);
	}

	getAuthor() {
		return user(this.authorID);
	}

	getGroup() {
		return group(this.groupID);
	}
}

class RobloxGroup {
	constructor(info) {
		this.name = info.name || info.Name;
		this.id = info.id || info.Id;
		if (info.owner) this.ownerID = info.owner.userId;
		if (info.Owner) this.ownerID = info.Owner.Id;
		if (info.owner) this.ownerName = info.owner.username;
		if (info.Owner) this.ownerName = info.Owner.Name;
		if (info.created) this.createdAt = new Date(info.created);
	}

	async getAllies() {
		var allies = await fetch(apiURI + `groups/${this.id}/allies`).then((res) => res.json());
		return new Collection(allies.Groups.map((g) => [g.Id, new RobloxGroup(g)]));
	}

	async getEnemies() {
		var enemies = await fetch(apiURI + `groups/${this.id}/enemies`).then((res) => res.json());
		if (enemies.code && enemies.message) throw new Error(`${enemies.code}: ${enemies.message}`);
		return new Collection(enemies.Groups.map((g) => [g.Id, new RobloxGroup(g)]));
	}

	async getThumbnailURL() {
		var thumbnail = await fetch(`https://www.roblox.com/group-thumbnails?params=%5B%7BgroupId:${this.id}%7D%5D`).then((res) => res.json());
		return thumbnail[0].thumbnailUrl;
	}

	async getRoleOf(userID) {
		var groups = await fetch(apiURI + `users/${userID}/groups`).then((res) => res.json());
		if (groups.errors) throw new Error(`${groups.errors[0].code}: ${groups.errors[0].message}`);
		var thisGroup = groups.find((g) => g.Id === this.id);
		if (thisGroup != null) {
			return new RobloxGroupRole({ Rank: thisGroup.Rank, Name: thisGroup.Role }, this.id);
		} else throw new Error("User is not in this group.");
	}

	async getRoles() {
		var roles = await fetch(apiURI + `groups/${this.id}`).then((res) => res.json());
		return roles.Roles.map((role) => new RobloxGroupRole(role));
	}

	async getShout() {
		var shout = await fetch(`https://groups.roblox.com/v2/groups?groupIds=${this.id}`)
			.then((res) => res.json());
		if (!shout.data[0].shout) throw new Error("No shout is currently visible in this group.");
		return new RobloxGroupShout(shout.data[0].shout, shout.data[0].id);
	}

	async getDescription() {
		var desc = await fetch(`https://groups.roblox.com/v2/groups?groupIds=${this.id}`)
			.then((res) => res.json());
		return desc.data[0].description;
	}

	async isBcOnly() {
		var bcOnly = await fetch(`https://groups.roblox.com/v1/groups/${this.id}`).then((res) => res.json());
		return bcOnly.isBuildersClubOnly;
	}

	async getMemberCount() {
		var memberCount = await fetch(`https://groups.roblox.com/v2/groups?groupIds=${this.id}`).then((res) => res.json());
		return memberCount.data[0].memberCount;
	}

	async getCreatedAt() {
		var createdAt = await fetch(`https://groups.roblox.com/v2/groups?groupIds=${this.id}`).then((res) => res.json());
		this.createdAt = new Date(createdAt.data[0].created);
		return this.createdAt;
	}

	getOwner() {
		return fetch(`https://groups.roblox.com/v2/groups?groupIds=${this.id}`)
			.then((res) => res.json())
			.then((group) => group.data[0].owner ? user(group.data[0].owner.id) : null);
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
		var games = await fetch(`https://www.roblox.com/users/profile/playergames-json?userId=${this.id}`).then((res) => res.json());
		return new Collection(games.Games.map((game) => [game.PlaceID, new RobloxPlace(game)]));
	}

	async getProfile() {
		var profile = await fetch(`https://www.roblox.com/users/${this.id}/profile`).then((res) => res.text());
		var friendsCount = parseFloat(profile.match(/data-friendscount=(\d+)/)[1]);
		var followersCount = parseFloat(profile.match(/data-followerscount=((\d|,)+)/)[1].replace(/,/g, ""));
		var followingCount = parseFloat(profile.match(/data-followingscount=((\d|,)+)/)[1].replace(/,/g, ""));
		var membership = profile.match(/<\/h2><span class=icon((?:t|o)bc)/) ? profile.match(/<\/h2><span class=icon-((?:t|o)bc)/)[1].toUpperCase() : "NBC";
		var joinDate = profile.match(/Join Date<p class=text-lead>((\d|\/)+)<li class=profile-stat>/)[1];
		var age = Math.ceil(
			(Date.now() / 86400000) -
			(new Date(joinDate).getTime() / 86400000)
		);
		var blurb = profile.match(/data-statustext=(.+?(?=data-editstatusmaxlength=))/)[1].trim();
		if (blurb.charAt(0) === "\"") blurb = blurb.slice(1);
		if (blurb.charAt(blurb.length - 1) === "\"") blurb = blurb.slice(0, -1);
		blurb = decodeHtmlEntity(blurb);
		var description = decodeHtmlEntity(profile.match(/t-text linkify" ng-non-bindable>((?:.|\n){0,1000})<\/span><span class=toggle-para d/)[1]);
		return { friendsCount, followersCount, followingCount, blurb, description, membership, age, joinDate };
	}

	async getMembership() {
		var membership = await fetch(`http://www.roblox.com/Thumbs/BCOverlay.ashx?username=${this.username}`);
		membership = membership.url.match(/overlay_((o|t)?bc)Only/);
		if (membership) return membership[1].toUpperCase();
		return "NBC";
	}

	async getAvatarURL() {
		var avatar = await fetch(`https://www.roblox.com/bust-thumbnail/image?userId=${this.id}&width=420&height=420&format=png`);
		return avatar.url;
	}

	async getPreviousUsernames(includeCurrent = false) {
		if (![true, false].includes(includeCurrent)) throw new TypeError("IncludeCurrent must be a boolean.");
		var usernames = await fetch(`https://newstargeted.com/api/roblox/Users/Usernames?userId=${this.id}`).then((res) => res.json());
		if (includeCurrent) usernames[0] = this.username;
		return usernames.slice(!includeCurrent);
	}

	async getPrimaryGroup() {
		var primaryGroup = await fetch(`https://www.roblox.com/Groups/GetPrimaryGroupInfo.ashx?users=${this.username}`).then((res) => res.json());
		if (primaryGroup[this.username]) {
			return await group(primaryGroup[this.username].GroupId);
		} else return null;
	}

	async getGroups() {
		var groups = await fetch(`https://groups.roblox.com/v1/users/${this.id}/groups/roles`).then((res) => res.json());
		return new Collection(groups.data.map((g) => [g.id, g]));
	}

	async canManageAsset(assetID) {
		var can = await fetch(apiURI + `users/${this.id}/canmanage/${assetID}`).then((res) => res.json());
		if (can.errors) throw new Error(`${can.errors[0].code}: ${can.errors[0].message}`);
		return can.CanManage;
	}

	async ownsAsset(assetID) {
		var owns = await fetch(apiURI + `ownership/hasasset?userId=${this.id}&assetId=${assetID}`).then((res) => res.json());
		if (owns.code && owns.message) throw new Error(`${owns.code}: ${owns.message}`);
		return owns;
	}

	async inGroup(groupID) {
		var isIn = await fetch(`https://assetgame.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=IsInGroup&playerid=${this.id}&groupid=${groupID}`)
			.then((res) => res.text());
		if (!/>(true|false)</.test(isIn)) throw new Error(isIn);
		return isIn.match(/>(true|false)</)[1].toBoolean();
	}

	async isFriendsWith(userID) {
		var friendsWith = await fetch(`https://assetgame.roblox.com/Game/LuaWebService/HandleSocialRequest.ashx?method=IsFriendsWith&playerId=${this.id}&userId=${userID}`)
			.then((res) => res.text());
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
		var user = await fetch(apiURI + `users/get-by-username?username=${username}`).then((res) => res.json());
		if (user.success) {
			return user.id;
		} else throw new Error(user.errorMessage);
	},

	usernameOwned: async function(username) {
		var taken = await fetch(`http://www.roblox.com/UserCheck/DoesUsernameExist?username=${username}`).then((res) => res.json());
		return taken.success;
	}
};
