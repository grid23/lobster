import path from "node:path"

function getFiletype(pathname, { args, build }) {
	return path.extname(pathname) || ".html"
}

async function _404(req, server, { args, build }) {
	return new Response("missing", { status: 404 })
}

export default async function createServer({ args, build }) {
	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: "./server/routes",
	})

	return Bun.serve({
		development: process.env.NODE_ENV === "development",
		port: 80,
		async fetch(req, server) {
			const url = new URL(req.url)

			switch (getFiletype(url.pathname, { args, build })) {
				case ".html":
					const match = router.match(url.pathname)
					const { default: handler = _404 } = match ? await import(match.filePath) : {}

					console.log("req(%s) match(%o)", req.url, match)
					return handler(req, server, { args, build })
				default:
					const file = Bun.file(path.join("./build", url.pathname))

					return file.size ? new Response(file) : _404(req, server, { args, build })
			}
		},
	})
}
