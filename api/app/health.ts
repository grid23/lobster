import path from "node:path"

export default async function health(req, server, { clients, db, router }, { args }) {
	const body = JSON.stringify({
		rdb: {
			open: db.isOpen,
			clients: clients.size,
		},
		router: {
			routes: Object.keys(router.routes).map(localPath => path.join(process.env.BASEPATH ?? "", localPath)),
		},
	})

	return new Response(body, {
		status: 200,
		headers: new Headers({
			"Content-Type": "application/json",
			"Content-Length": new TextEncoder().encode(body).length.toString(),
		}),
	})
}
