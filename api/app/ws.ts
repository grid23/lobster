import path from "node:path"

export default async function ws(req, server, db, args: Argv) {
	const upgrade = server.upgrade(req, {
		data: {
			id: "foo",
			type: "xxx",
		},
		headers: new Headers({
			"x-foo": "bar",
		}),
	})
	if (!upgrade) throw { status: 500, message: "Upgrade failed." }
	console.log(upgrade)
}
