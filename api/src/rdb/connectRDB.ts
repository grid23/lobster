import timers from "node:timers/promises"

export default async function connectRDB({db}){
  while (!db.isOpen) {
    try {
      await db.connect()
      await db.ping()
    } catch(err) {
      await timers.setTimeout(1000)
    }
  }

  return db
}