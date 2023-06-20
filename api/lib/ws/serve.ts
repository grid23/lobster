import type { ServerWebSocket } from "bun"
import type { RedisClientType } from "redis"

export class ClientMap extends Map {}
export class Client extends EventTarget {
	constructor(ws: ServerWebSocket) {
		super()
	}
}

export default function (db: RedisClientType, args: Argv) {
	const clients = new ClientMap()

	return (
		args.ws && {
			websocket: {
				async open(ws: ServerWebSocket) {
					console.log("open", ws.data)
					clients.set(ws, new Client(ws))
				},
				async close(ws: ServerWebSocket) {
					clients.delete(ws)
				},
				async message(ws: ServerWebSocket, message: string | ArrayBuffer | Uint8Array) {
					const client = clients.get(ws)
					client.message("foo", { foo: "bar" })
				},
			},
		}
	)
}
