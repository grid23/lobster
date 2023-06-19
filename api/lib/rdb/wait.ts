import timers from "node:timers/promises"

import type { RedisClientType as RedisClient } from "redis"

export default async function wait(db: RedisClient) {
	const maxAttempts = +(process.env.REDIS_RECONN_MAX_ATTEMPTS ?? 10)

	let attempts = 0
	while (!db.isReady) {
		try {
			console.log("attempt(%s) to open connect to rdb %s", attempts, db.url)
			await db.connect()
			await db.ping()
		} catch (err: any) {
			console.log("failed to connect to rdb %s => %s", db.url, err.message)

			if (attempts >= maxAttempts) process.exit(0)

			attempts += 1
			await timers.setTimeout(5000)
		}
	}

	return db
}
