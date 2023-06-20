import path from "node:path"

export default async function health(req, server, db, args) {
	const body = "OK"

	return new Response(body, {
		status: 200,
		headers: new Headers({
			"Content-Type": "text/plain",
			"Content-Length": new TextEncoder().encode(body).length.toString(),
		}),
	})
}
