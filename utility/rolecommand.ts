import { PermissionResolvable } from "discord.js";
import { ICommand, Call } from "@server/chat/commands";

export interface IRoleCommand {
	readonly id: string
	readonly reference?: string
	readonly roles?: string[]
	readonly allowMultiple: boolean
	readonly allowGive: boolean
	readonly allowTake: boolean
}

export class RoleCommand implements ICommand {
	public readonly id: string
	public botRequires?: PermissionResolvable | PermissionResolvable[]
	public botRequiresMessage?: string | string[]
	private readonly reference?: string
	private readonly response?: string
	private readonly roles?: string[]
	private readonly allowMultiple: boolean
	private readonly allowGive: boolean
	private readonly allowTake: boolean

	public constructor(command: IRoleCommand) {
		Object.assign(this, command);
		if (this.reference == null)
			this.reference = this.id;
		if (this.botRequires == null)
			this.botRequires = "MANAGE_ROLES";
		if (this.botRequiresMessage == null)
			this.botRequiresMessage = `To give/remove ${this.reference}s.`;
		if (this.response == null)
			this.response = `Please specify a valid ${this.reference} option. Options: \`${this.roles.join("`, `")}\`.`;
	}

	public exec(call: Call) {
		this.changeRole(call);
	}

	private isValidQuery(call: Call): boolean {
		return this.roles.includes((call.params.readRole(true, () => { return true; }, false) || { name: "" }).name.toUpperCase());
	}

	private async removeRoles(call: Call): Promise<void> {
		let member = call.message.member;
		var roles = member.roles.filter((r) => { return this.roles.includes(r.name.toUpperCase()); });
		await member.removeRoles(roles);
	}

	private async changeRole(call: Call): Promise<void> {
		let member = call.message.member;
		if (this.isValidQuery(call)) {
			if (!this.allowMultiple) await this.removeRoles(call);
			var role = call.params.readRole(true, () => { return true; }, false);
			if (member.roles.has(role.id)) {
				if (this.allowTake) {
					member.removeRole(role).then(() => {
						call.message.reply(`Successfully removed the \`${role.name}\` ${this.reference} from you.`).catch(() => {
							call.message.author.send(`Successfully removed the \`${role.name}\` ${this.reference} from you.`);
						});
					}).catch((exc) => {
						call.safeSend(`Unable to remove the \`${role.name}\` ${this.reference} from you.`);
						console.warn("Failed to remove role from user:");
						console.warn(exc.stack);
					});
				} else call.safeSend(`You already have the \`${role.name}\` ${this.reference}.`);
			} else {
				if (this.allowGive) {
					member.addRole(role).then(() => {
						call.message.reply(`Successfully added the \`${role.name}\` ${this.reference} to you.`).catch(() => {
							call.message.author.send(`Successfully added the \`${role.name}\` ${this.reference} to you.`);
						});
					}).catch((exc) => {
						call.safeSend(`Unable to add the \`${role.name}\` ${this.reference} to you.`);
						console.warn("Failed to remove role from user:");
						console.warn(exc.stack);
					});
				} else call.safeSend(`You don't have the \`${role.name}\` ${this.reference}.`);
			}
		} else call.safeSend(this.response);
	}
}
