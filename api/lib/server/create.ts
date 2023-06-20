import path from "node:path"

import route from "lib/server/handlers/route.ts"
import serveWS from "lib/ws/serve.ts"

function getFiletype(pathname: string, args: Argv) {
	return path.extname(pathname)
}

async function _404(req, server, { db, router }, args) {
	const body = `404\nNo handler for '${new URL(req.url).pathname}'.`

	return new Response(body, {
		status: 404,
		headers: new Headers({
			"Content-Type": "text/plain",
			"Content-Length": new TextEncoder().encode(body).length.toString(),
		}),
	})
}

async function _500(req, server, err: any, { db, router }, args) {
	const body = "Server error:\n" + process.env.NODE_ENV === "development" ? `${err.message}\n${err?.stack ?? ""}` : err.message

	return new Response(body, {
		status: 500,
		headers: new Headers({
			"Content-Type": "text/plain",
			"Content-Length": new TextEncoder().encode(body).length.toString(),
		}),
	})
}

const basePathRegExp = new RegExp(`^${process.env.BASEPATH ?? ""}`)

export default async function serve(db, args) {
	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: "app",
	})

	console.log(router.routes)

	return Bun.serve(
		Object.assign(
			{
				development: process.env.NODE_ENV === "development",
				port: 80,
				async fetch(req, server) {
					const url = new URL(req.url)
					const pathname = url.pathname.replace(basePathRegExp, "")
					const filetype = getFiletype(pathname, args)

					switch (filetype) {
						case "":
						case ".html": {
							const match = router.match(pathname)
							const { default: handler = _404 } = match ? await import(match.filePath) : {}

							return handler(req, server, db, args).catch((err: any) => {
								switch (err?.status) {
									case 404: {
										return _404(req, server, db, args)
									}
									default: {
										console.error(err)
										return _500(req, server, err, db, args)
									}
								}
							})
						}
						case ".js": {
							if (process.env.NODE_ENV === "development") {
								const filename = path.basename(pathname)
								const entry = path.join("./src", filename)
								const buildCandidate = Bun.file(entry)

								if (buildCandidate.size) {
									await Bun.build({
										entrypoints: [entry],
										outdir: "./build",
										splitting: false,
										naming: `[dir]/${filename}`,
										minify: process.env.NODE_ENV !== "development",
										external: [],
										target: "browser",
										define: {
											"process.env.BASEPATH": `"${process.env.BASEPATH}"`,
										},
									})
								}
							}
						}
						default: {
							const file = Bun.file(path.join("./build", pathname))
							return file.size ? new Response(file) : _404(req, server, db, args)
						}
					}
				},
			},
			serveWS(db, args)
		)
	)
}
