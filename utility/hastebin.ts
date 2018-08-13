import Request, * as fetch from "node-fetch";

export async function post(content: string) {
	if (content.length > 400000) throw new Error("Content exceeds maximum length of 400000.");
	if (content.length < 0) throw new Error("Content is below 0 characters.");
	var post = await fetch("https://hastebin.com/documents", { method: "POST", body: content }).then((res: Request) => res.json());
	if (post.message) throw new Error(post.message);
	return post.key;
}

export async function get(key: string) {
	if (key.length !== 10) throw new Error("Key must be exactly 10 characters long.");
	if (key.match(/[a-zA-Z]{10}/) != null) throw new Error("Invalid key.");
	var result = fetch(`https://hastebin.com/documents/${key.toLowerCase()}`).then((res: Request) => res.json());
	if (result.message) throw new Error(result.message);
	return result.data;
}
