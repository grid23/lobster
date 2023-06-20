import timers from "node:timers/promises"

import redis from "redis"
import type { RedisClientType as RedisClient } from "redis"

export default async function createRDB<RedisClient>(args: Object) {
	const protocol = JSON.parse(process.env?.REDIS_SSL ?? "false") ? "rediss:" : "redis:"
	const host = process.env.REDIS_URL
	const port = +(process.env.REDIS_PORT ?? "6379")
	const url = `${protocol}//${host}:${port}`
	const password = process.env.REDIS_TOKEN
	const db = redis.createClient({
		url,
		password,
	})

	const maxAttempts = +(process.env.REDIS_CONN_MAX_ATTEMPTS ?? 50)
	let attempts = 0
	while (!db.isReady) {
		try {
			console.log("attempt(%s) to open connect to rdb %s", attempts, url)
			await db.connect()
			await db.ping()
		} catch (err: any) {
			console.log("failed to connect to rdb %s => %s", url, err)

			if (attempts >= maxAttempts) process.exit(0)

			attempts += 1
			await timers.setTimeout(5000)
		}
	}

	console.log("rdb %s connection is open", url)
	return db
}
