import html from "../serve/html.js"

export default async function (req, server, { args, build }) {
	return html(req, server, { args, build })
}
