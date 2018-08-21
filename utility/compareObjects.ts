import { GuildMember, Role } from "discord.js";

function memberPos(member: GuildMember) {
	return member.guild.ownerID === member.id ? Infinity : member.highestRole.position;
}

export default function compareObjects(member: GuildMember, target: GuildMember | Role) {
	var pos1 = memberPos(member);
	var pos2 = target instanceof GuildMember ? memberPos(target) : target.position;
	return pos1 > pos2;
}
