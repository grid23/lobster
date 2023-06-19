import createRDB from "rdb/createRDB"
import serve from "cmd/serve"

export default async function dev(args){
  const db = await createRDB(args)
  const server = await serve({ args, db })

}
