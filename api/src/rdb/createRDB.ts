import redis from "redis"
import connectRDB from "rdb/connectRDB"

export default async function createRDB(args){
  const protocol = JSON.parse(process.env?.REDIS_SSL??"false") ? "rediss:" : "redis:"
  const host = process.env.REDIS_URL
  const port = +(process.env.REDIS_PORT??"6379")
  const url = `${protocol}//${host}:${port}`
  const password = process.env.REDIS_TOKEN
  const db = redis.createClient({
    url, password
  })

  await connectRDB({db})
  await db.disconnect()

  return db
}