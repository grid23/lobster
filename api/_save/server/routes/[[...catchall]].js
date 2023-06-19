export default async function (req, server, { build }) {
	return new Response("catchall", {
		status: 200,
		headers: {
			"content-type": "text/plain",
		},
	})
}
