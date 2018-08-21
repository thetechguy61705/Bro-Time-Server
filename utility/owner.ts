export const OWNERS = ["236341625763135500", "245877990938902529", "432650511825633317", "433065327836790784"];

export function isOwner(input): boolean {
	return OWNERS.includes(input) || OWNERS.includes(input.id);
}

export function addOwner(input): number {
	return OWNERS.push(input.id || input);
}
