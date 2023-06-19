import fs from "node:fs/promises"

async function* asStandalone(args, env) {
	for (const partAndConstrains of env.compose ?? []) {
		const [part, constrains] = Array.isArray(partAndConstrains) ? partAndConstrains : [partAndConstrains]
		const candidates = [`compose.${part}.yml`, args.dev && `compose.${part}.dev.yml`, `compose.${part}.user.yml`].filter(Boolean)
		const hits = []

		let valid = true
		for (const [key, value] of Object.entries(constrains ?? [])) {
			if (!!args[key] !== value) valid = false
		}

		if (valid)
			for (const candidate of candidates) {
				try {
					await fs.access(candidate, fs.constants.F_OK)
					hits.push("-f", candidate)
				} catch (err) {
					if (err.code !== "ENOENT") throw err
				}
			}

		yield hits
	}
}
async function* asSwarm(args, env) {
	throw new Error("swarm mode not implemented")
}

export default function compose(args, env) {
	return args.swarm ? asSwarm(args, env) : asStandalone(args, env)
}
