import path from "node:path"

function getFiletype(pathname: string, { args }) {
	return path.extname(pathname) || ".html"
}

async function _404(req, server, { db }, { args }) {
	const body = `No handler for '${new URL(req.url).pathname}'.`

	return new Response(body, {
		status: 404,
		headers: new Headers({
			"Content-Type": "text/plain",
			"Content-Length": new TextEncoder().encode(body).length.toString(),
		}),
	})
}

async function _500(req, server, err: any, { db }, { args }) {
	const body = process.env.NODE_ENV === "development" ? `${err.message}\n${err.stack}` : err.message

	return new Response(body, {
		status: 500,
		headers: new Headers({
			"Content-Type": "text/plain",
			"Content-Length": new TextEncoder().encode(body).length.toString(),
		}),
	})
}

const basePathRegExp = new RegExp(`^${process.env.BASEPATH ?? ""}`)

export default async function serve({ clients, db }, { args }) {
	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: "app",
	})

	return Bun.serve({
		development: process.env.NODE_ENV === "development",
		port: 80,
		async fetch(req, server) {
			const url = new URL(req.url)
			const pathname = url.pathname.replace(basePathRegExp, "")
			const match = router.match(pathname)
			const { default: handler = _404 } = match ? await import(match.filePath) : {}
			return handler(req, server, { clients, db, match, router }, { args }).catch((err: any) => {
				console.error(err)
				return _500(req, server, err, { clients, db, match, router }, { args })
			})
		},
	})
}
