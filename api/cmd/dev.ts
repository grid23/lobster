import createRDB from "lib/rdb/create.ts"
import createServer from "lib/server/create.ts"

export default async function dev(args: Argv) {
	const db = await createRDB(args)
	const server = await createServer(db, args)
}
