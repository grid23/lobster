import createBuild from "./build.js"
import createServer from "./serve.js"

export default async function dev({ args }) {
	const build = await createBuild({ args })
	const server = await createServer({ args, build })

	return { build, server }
}
