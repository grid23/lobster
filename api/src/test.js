async function createWebSocket() {
	const url = Object.assign(new URL(process.env.BASEPATH + "/ws", location.origin), { protocol: "wss:" })
	const ws = new WebSocket(url)

	return new Promise((resolve, reject) => {
		const onopen = () => {
			cleanup()
			resolve(ws)
		}
		const onerror = err => {
			cleanup()
			reject(err)
		}

		const cleanup = () => {
			ws.removeEventListener("error", onerror, { once: true })
			ws.removeEventListener("open", onopen, { once: true })
		}

		ws.addEventListener("error", onerror, { once: true })
		ws.addEventListener("open", onopen, { once: true })
	})
		.then(ws => {
			console.log("connected to websocket(%o)", ws)
			return [null, ws]
		})
		.catch(err => {
			console.log("failed to connect to websocket(%o)", ws)
			return [err, null]
		})
}

async function main() {
	const [err, ws] = await createWebSocket()

	if (err) {
		console.error(err)
		return await new Promise(resolve => setTimeout(resolve, 5000)).then(main)
	}

	const onclose = () => location.reload()
	ws.addEventListener("close", onclose)
	ws.addEventListener("error", onclose)
}

main()

const set = new Set()
const wr = (function () {
	const wr = new WeakRef({ foo: "bar" })
	set.add(wr)
	return wr
})()

setInterval(() => {
	console.log(wr, set.has(wr))
}, 5000)
