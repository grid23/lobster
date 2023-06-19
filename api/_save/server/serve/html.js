import * as ReactDOMServer from "react-dom/server"

import Server from "../../client/www/Server.jsx"

export default async function (req, server, { args, build }) {
	const controller = new AbortController()
	let didError = false

	try {
		const stream = await ReactDOMServer.renderToReadableStream(<Server req={req} build={build} />, {
			signal: controller.signal,
			onError(error) {
				didError = true
				console.error(error)
			},
		})

		return new Response(stream, {
			status: didError ? 500 : 200,
			headers: { "Content-Type": "text/html" },
		})
	} catch (error) {
		return new Response("<!doctype html>error", {
			status: 500,
			headers: { "Content-Type": "text/html" },
		})
	}
}
