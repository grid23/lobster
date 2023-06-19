import createRDB from "lib/rdb/create.ts"
import createClients from "lib/server/clients.ts"
import createServer from "lib/server/create.ts"

export default async function dev(args) {
	const db = await createRDB(args)
	const clients = await createClients({ db }, { args })
	const server = await createServer({ clients, db }, { args })
}
