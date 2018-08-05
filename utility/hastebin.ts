import * as fetch from "node-fetch";

export async function post(content: string) {
	var post = await fetch("https://hastebin.com/documents", { method: "POST", body: content });
	post = await post.json();
	return post.key;
}
