import Request, * as fetch from "node-fetch";

export async function post(content: string) {
	var post = await fetch("https://hastebin.com/documents", { method: "POST", body: content }).then((res: Request) => res.json());
	return post.key;
}
